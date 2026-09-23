import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type TeamRole = "staff" | "admin";

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Safe to ignore when cookies cannot be written
            // from a server component context.
          }
        },
      },
    },
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      profile: null,
      error: "You must be signed in.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      user,
      profile: null,
      error: "Your R&R profile could not be found.",
    };
  }

  if (profile.role !== "admin") {
    return {
      user,
      profile,
      error: "Administrator access is required.",
    };
  }

  return {
    user,
    profile,
    error: null,
  };
}

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const secret =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!secret) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createSupabaseAdmin(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * GET
 *
 * Load all R&R staff and administrators.
 */
export async function GET() {
  try {
    const auth = await getAuthenticatedAdmin();

    if (auth.error) {
      return NextResponse.json(
        {
          error: auth.error,
        },
        {
          status: auth.user ? 403 : 401,
        },
      );
    }

    const admin = getAdminSupabase();

    const { data: team, error } = await admin
      .from("profiles")
      .select(
        "id, email, full_name, phone, role, created_at, updated_at",
      )
      .in("role", ["staff", "admin"])
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      team: team ?? [],
    });
  } catch (error) {
    console.error("ADMIN TEAM GET ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the R&R team.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST
 *
 * Invite a new employee or assign an existing
 * R&R customer to the staff/admin team.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedAdmin();

    if (auth.error) {
      return NextResponse.json(
        {
          error: auth.error,
        },
        {
          status: auth.user ? 403 : 401,
        },
      );
    }

    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const role: TeamRole =
      body.role === "admin"
        ? "admin"
        : "staff";

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!fullName) {
      return NextResponse.json(
        {
          error: "Full name is required.",
        },
        {
          status: 400,
        },
      );
    }

    const admin = getAdminSupabase();

    /*
     * Check whether the email already belongs
     * to a Supabase Auth user.
     */
    const {
      data: usersData,
      error: usersError,
    } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) {
      return NextResponse.json(
        {
          error: usersError.message,
        },
        {
          status: 500,
        },
      );
    }

    const existingUser = usersData.users.find(
      (user) =>
        user.email?.toLowerCase() === email,
    );

    /*
     * EXISTING ACCOUNT
     *
     * Convert an existing customer account
     * into staff/admin access.
     */
    if (existingUser) {
      /*
       * Prevent an administrator from changing
       * their own role.
       */
      if (existingUser.id === auth.user?.id) {
        return NextResponse.json(
          {
            error:
              "You cannot change your own administrator access.",
          },
          {
            status: 400,
          },
        );
      }

      const {
        data: member,
        error,
      } = await admin
        .from("profiles")
        .upsert(
          {
            id: existingUser.id,
            email,
            full_name: fullName,
            phone: phone || null,
            role,
          },
          {
            onConflict: "id",
          },
        )
        .select(
          "id, email, full_name, phone, role",
        )
        .single();

      if (error) {
        return NextResponse.json(
          {
            error: error.message,
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json({
        success: true,
        action: "assigned",
        message: `${email} has been given ${role} access.`,
        member,
      });
    }

    /*
     * NEW ACCOUNT
     *
     * Send an invitation through Supabase Auth.
     */
    const {
      data: invitation,
      error: inviteError,
    } = await admin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          full_name: fullName,
          phone,
        },

        redirectTo:
          `${request.nextUrl.origin}/auth/callback`,
      },
    );

    if (inviteError) {
      return NextResponse.json(
        {
          error: inviteError.message,
        },
        {
          status: 400,
        },
      );
    }

    if (!invitation.user) {
      return NextResponse.json(
        {
          error:
            "Supabase did not return the invited user.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * Create the R&R profile with the selected
     * staff/admin role.
     */
    const {
      error: profileError,
    } = await admin
      .from("profiles")
      .upsert(
        {
          id: invitation.user.id,
          email,
          full_name: fullName,
          phone: phone || null,
          role,
        },
        {
          onConflict: "id",
        },
      );

    if (profileError) {
      return NextResponse.json(
        {
          error:
            "The invitation was created, but the R&R profile could not be assigned.",
          details: profileError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      action: "invited",
      message: `Invitation sent to ${email}.`,
      member: {
        id: invitation.user.id,
        email,
        full_name: fullName,
        phone,
        role,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN TEAM POST ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create or assign team access.",
      },
      {
        status: 500,
      },
    );
  }
}