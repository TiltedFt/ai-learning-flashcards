import { getSession } from "@/services/auth.service";
import { userRepository } from "@/lib/queries/user.repo";
import NavbarClient from "./navbar-client";

export default async function Navbar() {
  const session = await getSession();
  if (!session) return null;

  const user = await userRepository
    .findByEmail(session.email)
    .catch(() => null);
  const fullName =
    (user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "") ||
    session.email;

  return <NavbarClient fullName={fullName} />;
}
