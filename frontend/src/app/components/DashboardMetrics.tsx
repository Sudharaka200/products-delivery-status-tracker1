import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metrics } from "@/lib/types";

interface Props {
  metrics: Metrics;
}

//metrics
export default function DashboardMetrics({ metrics }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Shipments</CardTitle>
        </CardHeader>
        <CardContent>{metrics.total_shipments}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Success Rate</CardTitle>
        </CardHeader>
        <CardContent>{metrics.success_rate}%</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>FedEx Success</CardTitle>
        </CardHeader>
        <CardContent>{metrics.fedex_success}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>DHL Success</CardTitle>
        </CardHeader>
        <CardContent>{metrics.dhl_success}</CardContent>
      </Card>
    </div>
  );
}