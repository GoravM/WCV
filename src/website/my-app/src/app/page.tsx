import { getSystemDetails } from "@/app/lib/system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function Home() {
  const systemInfo = await getSystemDetails();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <h1>HELLO</h1>
    </main>
  );
}
