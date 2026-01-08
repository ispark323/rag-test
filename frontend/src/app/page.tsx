"use client";

import { DocumentUpload } from "@/components/document-upload";
import { RagQuery } from "@/components/rag-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Trash2, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [health, setHealth] = useState<{ status: string; version: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.healthCheck();
        setHealth(response);
      } catch (err) {
        console.error("Health check failed:", err);
      }
    };

    checkHealth();
  }, []);

  const handleDeleteCollection = async () => {
    if (!confirm("정말로 모든 문서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setDeleting(true);
    try {
      await api.deleteCollection();
      alert("컬렉션이 성공적으로 삭제되었습니다.");
    } catch (err: any) {
      alert(err.message || "컬렉션 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                RAG Application
              </h1>
              <p className="text-muted-foreground">
                LangChain, Qdrant, OpenAI를 활용한 한국어 지원 RAG 시스템
              </p>
            </div>
            {health && (
              <Card>
                <CardContent className="flex items-center gap-2 pt-6">
                  <Activity className="h-4 w-4 text-green-500" />
                  <div className="text-sm">
                    <div className="font-medium">서버 상태: {health.status}</div>
                    <div className="text-muted-foreground">버전: {health.version}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DocumentUpload />

            <Card>
              <CardContent className="pt-6">
                <Button
                  variant="destructive"
                  onClick={handleDeleteCollection}
                  disabled={deleting}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? "삭제 중..." : "모든 문서 삭제"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <RagQuery />
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>RAG 시스템으로 문서를 인덱싱하고 질의할 수 있습니다.</p>
        </footer>
      </div>
    </div>
  );
}
