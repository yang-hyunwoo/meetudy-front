import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudyGroup {
  id: number;
  title: string;
  description: string;
  href?: string;
}

interface RecommendedStudyGroupsProps {
  groups: StudyGroup[];
}

export default function RecommendedStudyGroups({
  groups,
}: RecommendedStudyGroupsProps) {
  return (
    <section className="py-8">
      <h2 className="text-xl font-semibold mb-4">🔥 추천 스터디 그룹</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {group.description}
              </p>
              {group.href ? (
                <Button size="sm" asChild>
                  <Link href={group.href}>상세보기</Link>
                </Button>
              ) : (
                <Button size="sm" disabled>
                  상세보기
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
