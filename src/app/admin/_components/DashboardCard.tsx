import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardCardProps = {
   title: string;
   subtitle: string;
   body: string;
};

export default function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
   return (
      <Card className="hover:shadow-lg transition-shadow">
         <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <p className="text-sm text-gray-500">{subtitle}</p>
         </CardHeader>
         <CardContent>
            <p className="text-xl font-bold">{body}</p>
         </CardContent>
      </Card>
   );
}
