import { getSession } from "@/core/services/auth.service";
import { userRepository } from "@/core/repositories/user.repo";
import NavbarClient from "./navbar-client";
import { UnauthorizedError } from "@/shared/lib/errors";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const session = await getSession();
  if (!session) return redirect("/login");

  const user = await userRepository.findByEmailWithouthPw(session.email);
  if (!user) {
    throw new UnauthorizedError();
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return <NavbarClient fullName={fullName} />;
}
