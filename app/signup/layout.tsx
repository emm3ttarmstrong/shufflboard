// Force dynamic rendering for auth pages
export const dynamic = "force-dynamic"

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
