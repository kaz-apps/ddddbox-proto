import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Ordinance {
  id: string;
  name: string;
  description: string;
  enactmentDate: string;
  municipality: string;
}

interface OrdinanceListProps {
  ordinances: Ordinance[];
  municipality: string;
}

export function OrdinanceList({ ordinances, municipality }: OrdinanceListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{municipality}の条例一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>条例名</TableHead>
              <TableHead>概要</TableHead>
              <TableHead>制定日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordinances.map((ordinance) => (
              <TableRow key={ordinance.id}>
                <TableCell>{ordinance.name}</TableCell>
                <TableCell>{ordinance.description}</TableCell>
                <TableCell>{ordinance.enactmentDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 