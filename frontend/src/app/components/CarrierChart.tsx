import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Metrics } from "@/lib/types";

// add chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  metrics: Metrics;
}

export default function CarrierChart({ metrics }: Props) {
  const data = {
    labels: ["FedEx", "DHL"],
    datasets: [
      {
        label: "Successful Deliveries",
        data: [metrics.fedex_success, metrics.dhl_success],
        backgroundColor: ["#10B981", "#F59E0B"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Carrier Performance" },
    },
  };

  return <Bar data={data} options={options} />;
}