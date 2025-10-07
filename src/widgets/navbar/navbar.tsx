import { getSession } from "@/core/services/auth.service";
import { userRepository } from "@/core/repositories/user.repo";
import NavbarClient from "./navbar-client";

export default async function Navbar() {
  const session = await getSession();
  if (!session) return null;

  const user = await userRepository.findByEmailWithouthPw(session.email);
  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;

  return <NavbarClient fullName={fullName} />;
}
