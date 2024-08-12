export function extractDriverData(user: any) {
  return {
    name: `${user.given_name} ${user.family_name}`,
    email: user.email,
    phone_number: user.phone_number ?? 1234567890,
    location: user.properties.city ?? undefined,
  };
}

export async function UpdateProfile(email: string, updates: any) {}
