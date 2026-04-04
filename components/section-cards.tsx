"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "../components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Eleve } from "@/lib/supabase/eleves";
import { Evaluation } from "@/lib/supabase/evaluations";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Props = {
  eleves?: Eleve[];
  evaluations?: Evaluation[];
};

export function SectionCards({ eleves, evaluations }: Props) {

  const supabase = createClient();

  const [elevesState, setEleves] = useState<Eleve[]>([]);
  const [evaluationsState, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eleves } = await supabase.from("students").select("*");
      const { data: evaluations } = await supabase.from("evaluations").select("*");

      setEleves(eleves || []);
      setEvaluations(evaluations || []);
    };

    fetchData();
  }, []);
  // SAFE DATA
  const safeEleves = elevesState;
  const safeEvaluations = evaluationsState;

  console.log("ELEVE FROM STATE:", elevesState);
  console.log("ELEVE FROM PROPS:", eleves);

  // DATE RANGE
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  // ÉLÈVES CE MOIS
  const elevesCeMois = safeEleves.filter((e, i) => {
    if (!e.created_at) {
      console.log("❌ created_at NULL:", e);
      return false;
    }

    const date = new Date(e.created_at);

    if (isNaN(date.getTime())) {
      console.log("❌ date invalide:", e.created_at);
      return false;
    }

    const inRange = date >= startOfMonth && date <= endOfMonth;

    console.log(`ELEVE ${i}`, {
      raw: e.created_at,
      parsed: date,
      inRange,
    });

    return inRange;
  }).length;

  // ÉVALUATIONS CE MOIS
  const evaluationsCeMois = safeEvaluations.filter((e) => {
    if (!e.date) return false;

    const d = new Date(e.date);
    if (isNaN(d.getTime())) return false;

    return d >= startOfMonth && d <= endOfMonth;
  });

  // MOYENNE
  const moyenneGenerale =
    safeEvaluations.length > 0
      ? (
          safeEvaluations.reduce((sum, e) => sum + e.note, 0) /
          safeEvaluations.length
        ).toFixed(2)
      : "0";

  // TAUX RÉUSSITE
  const tauxReussite =
    safeEvaluations.length > 0
      ? (
          (safeEvaluations.filter((e) => e.note >= 10).length /
            safeEvaluations.length) *
          100
        ).toFixed(1)
      : "0";

  // MEILLEURE CLASSE
  const bestClasse = (() => {
    const map: Record<string, number[]> = {};

    safeEvaluations.forEach((e) => {
      const classe = (e as any).classe || "Inconnue";
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

  // TREND
  const lastMonth = new Date();
  lastMonth.setMonth(now.getMonth() - 1);

  const evalLastMonth = safeEvaluations.filter((e) => {
    if (!e.date) return false;

    const d = new Date(e.date);
    return (
      d.getMonth() === lastMonth.getMonth() &&
      d.getFullYear() === lastMonth.getFullYear()
    );
  }).length;

  const trend = evaluationsCeMois.length - evalLastMonth;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total des élèves</CardDescription>
          <CardTitle>{safeEleves.length}</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{safeEleves.length}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Nouveaux élèves ce mois</CardDescription>
          <CardTitle>{elevesCeMois}</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{elevesCeMois}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Moyenne générale</CardDescription>
          <CardTitle>{moyenneGenerale} / 20</CardTitle>
          <CardAction>
            <Badge variant="outline">
              {trend >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {trend}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Taux de réussite</CardDescription>
          <CardTitle>{tauxReussite}%</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Évaluations ce mois</CardDescription>
          <CardTitle>{evaluationsCeMois.length}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Meilleure classe</CardDescription>
          <CardTitle>{bestClasse}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}