"use client";

import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import styles from "../Home.module.css";

type LogItem = { expression: string; result: string | number };

export default function Calculator() {
  const [loading, setLoading] = useState(false);
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | number>("—");

  const [last, setLast] = useState<LogItem | null>(null);
  const [history, setHistory] = useState<LogItem[]>([]);

  const canSubmit = expression.trim().length > 0 && !loading;

  const historyReversed = useMemo(() => {
    return [...history].reverse();
  }, [history]);

  function returnToExpression(expr: string) {
    setExpression(expr);
  }

  const handleCalculate = async () => {
    if (!expression.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/calc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ expression }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error || `Request failed (HTTP ${res.status})`;
        setResult(msg);
        return;
      }

      const next: LogItem = { expression, result: data.result };
      setLast(next);
      setHistory((prev) => [...prev, next]);

      setResult(data?.error ? data.error : data.result);
    } catch {
      setResult("Error connecting to service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Calculator</h1>
        <p className={styles.subtitle}>
          Enter an expression and get the
          result.
        </p>

        <section className={styles.wrapper}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Calculate</h2>
              <p className={styles.muted}>{loading ? "Working…" : "Ready"}</p>
            </div>

            <div className={styles.form}>
              <label className={styles.label} htmlFor="expression">
                Expression
              </label>

              <Input
                id="expression"
                type="text"
                placeholder="e.g. (10-3)*2"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              />

              <div className={styles.actions}>
                <Button
                  onClick={handleCalculate}
                  variant="outline"
                  disabled={!canSubmit}
                >
                  Calculate
                </Button>
                {loading ? <Spinner /> : null}
              </div>

              <div className={styles.resultBox}>
                <span className={styles.resultLabel}>Result</span>
                <div className={styles.resultValue}>{String(result)}</div>
              </div>
            </div>
          </div>

          <div className={styles.gridRight}>
            {last ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Last calculation</h2>
                </div>

                <div className={styles.logEntry}>
                  <div className={styles.kv}>
                    <div className={styles.k}>Expression</div>
                    <div className={styles.v}>{last.expression}</div>
                  </div>
                  <div className={styles.kv}>
                    <div className={styles.k}>Result</div>
                    <div className={styles.v}>{String(last.result)}</div>
                  </div>
                </div>
              </div>
            ) : null}

            {history.length ? (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>History</h2>
                  <p className={styles.muted}>{history.length} item(s)</p>
                </div>

                <div className={styles.scroll}>
                  <div className={styles.logList}>
                    {historyReversed.map((item, idx) => (
                      <div
                        key={`${item.expression}:${idx}`}
                        className={styles.logEntry}
                      >
                        <div className={styles.kv}>
                          <div className={styles.k}>Expression</div>
                          <div className={styles.v}>{item.expression}</div>
                        </div>
                        <div className={styles.kv}>
                          <div className={styles.k}>Result</div>
                          <div className={styles.v}>{String(item.result)}</div>
                          <div className="flex flex-row gap-2 w-[300px] ">
                            <button
                              onClick={() =>
                                returnToExpression(item.expression)
                              }
                              type="button"
                            >
                              Return to expression
                            </button>
                            <button
                              onClick={() => {
                                setHistory((prev) =>
                                  prev.filter(
                                    (h) =>
                                      h.expression !== item.expression ||
                                      h.result !== item.result,
                                  ),
                                );
                              }}
                              type="button"
                            >
                              Remove from history
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setHistory([]);
                  }}
                  type="button"
                >
                  Clear history
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
