"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

export function DocumentUpload() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!text.trim()) {
      setError("문서 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.uploadDocument({ text });
      setSuccess(true);
      setText("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "문서 업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>문서 업로드</CardTitle>
        <CardDescription>
          RAG 시스템에 인덱싱할 문서를 입력하세요. 한글과 영어를 모두 지원합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="여기에 문서 내용을 입력하세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px]"
        />

        {error && (
          <div className="text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            문서가 성공적으로 업로드되었습니다!
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={loading || !text.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              업로드 중...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              문서 업로드
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
