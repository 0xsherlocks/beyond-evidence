import AuthModalGuard from "@/src/components/AuthModalGuard";

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <AuthModalGuard>{children}</AuthModalGuard>;
}
