"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, type QueryResponse } from "@/lib/api";
import { Search, Loader2 } from "lucide-react";

export function RagQuery() {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async () => {
    if (!query.trim()) {
      setError("질문을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.query({ query, top_k: topK });
      setResult(response);
    } catch (err: any) {
      setError(err.message || "쿼리 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>RAG 질의</CardTitle>
          <CardDescription>
            문서에 대한 질문을 입력하세요. AI가 문서를 검색하여 답변을 생성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="질문을 입력하세요..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">
                검색 결과 수:
              </label>
              <Input
                type="number"
                min={1}
                max={10}
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-16"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleQuery}
            disabled={loading || !query.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                검색 중...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                질의하기
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>답변</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{result.answer}</p>
            </CardContent>
          </Card>

          {result.sources && result.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>참고 문서</CardTitle>
                <CardDescription>
                  답변 생성에 사용된 문서들입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.sources.map((source, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-muted/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        소스 {index + 1}
                      </Badge>
                      {source.score && (
                        <span className="text-xs text-muted-foreground">
                          유사도: {(source.score * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{source.text}</p>
                    {source.metadata && Object.keys(source.metadata).length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {Object.entries(source.metadata).map(([key, value]) => (
                          <div key={key}>
                            {key}: {String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
