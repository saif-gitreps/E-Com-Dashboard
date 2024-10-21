export function PageHeader({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return <h1 className={`text-4xl mb-4 ${className}`}>{children}</h1>;
}
