"use client"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "../components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Eleve } from "@/lib/supabase/eleves";
import { Evaluation } from "@/lib/supabase/evaluations";
type Props = {
  eleves : Eleve[];
  evaluations : Evaluation[];
};

export function SectionCards({eleves, evaluations}: Props) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const elevesCeMois = eleves.filter((e) => {
    const date = new Date(e.created_at);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  }).length;

  // 📝 Évaluations ce mois
  const evaluationsCeMois = evaluations.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  //Moyenne générale
  const moyenneGenerale =
    evaluations.length > 0
      ? (
          evaluations.reduce((sum, e) => sum + e.note, 0) /
          evaluations.length
        ).toFixed(2)
      : "0";

  //% réussite (>=10)
  const tauxReussite =
    evaluations.length > 0
      ? (
          (evaluations.filter((e) => e.note >= 10).length /
            evaluations.length) *
          100
        ).toFixed(1)
      : "0";

  //Meilleure classe (simple version)
  const bestClasse = (() => {
    const map: Record<string, number[]> = {};

    evaluations.forEach((e) => {
      const classe = (e as any).classe || "Inconnue"; // adapte selon ton modèle
      if (!map[classe]) map[classe] = [];
      map[classe].push(e.note);
    });

    let best = "N/A";
    let bestAvg = 0;

    Object.entries(map).forEach(([classe, notes]) => {
      const avg = notes.reduce((a, b) => a + b, 0) / notes.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        best = classe;
      }
    });

    return best;
  })();

  const lastMonth = new Date();
  lastMonth.setMonth(currentMonth - 1);

  const evalLastMonth = evaluations.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === lastMonth.getMonth() &&
      d.getFullYear() === lastMonth.getFullYear()
    );
  }).length;

  const trend = evaluationsCeMois.length - evalLastMonth;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Nombre total d’élèves</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {elevesCeMois}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{elevesCeMois}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Nouveaux élèves ce mois
          </div>
          <div className="text-muted-foreground">
            Données issues des inscriptions
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Moyenne générale actuelle</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {moyenneGenerale} / 20
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {trend >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {trend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>% de réussite (10/20)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
           {tauxReussite}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {trend >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
  {trend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Nombre d’évaluations saisies ce mois</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {evaluationsCeMois.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {trend >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
  {trend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Meilleure classe</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {bestClasse}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {trend >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
  {trend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
