export default function LayoutExams({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1>exams dentro</h1>
      {children}
    </div>
  );
}
