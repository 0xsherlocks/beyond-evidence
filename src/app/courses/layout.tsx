import AuthModalGuard from "@/src/components/AuthModalGuard";

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <AuthModalGuard>{children}</AuthModalGuard>;
}
