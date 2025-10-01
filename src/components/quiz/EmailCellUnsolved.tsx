import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type EmailCellProps = { emails: string[] };

function computeFitCount(
  emailWidths: number[],
  sepWidth: number,
  containerWidth: number,
) {
  let total = 0;
  let count = 0;
  for (let i = 0; i < emailWidths.length; i++) {
    const add = emailWidths[i] + (i > 0 ? sepWidth : 0);
    if (total + add <= containerWidth) {
      total += add;
      count++;
    } else break;
  }
  return count;
}

export const EmailCellUnsolved: React.FC<EmailCellProps> = ({ emails }) => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const [containerW, setContainerW] = useState(0);
  const [emailWidths, setEmailWidths] = useState<number[]>([]);
  const [sepW, setSepW] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  // (3) normalize emails (filter empty/whitespace) — used in measurement & render
  const normalized = useMemo(
    () => (emails ?? []).map((e) => (e ?? "").trim()).filter(Boolean),
    [emails],
  );

  // (2) resizeObserver + rAF
  const rafId = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (!outerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.max(0, Math.floor(entry.contentRect.width));
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => setContainerW(next));
    });
    ro.observe(outerRef.current);
    return () => {
      ro.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  //calculate every email with sepearator
  useEffect(() => {
    if (!measureRef.current) return;

    const host = measureRef.current;
    host.innerHTML = "";

    const sep = document.createElement("span");
    sep.className = "email-text";
    sep.textContent = ", ";
    host.appendChild(sep);

    const spans: HTMLSpanElement[] = [];
    normalized.forEach((e) => {
      const s = document.createElement("span");
      s.className = "email-text";
      s.textContent = e;
      host.appendChild(s);
      spans.push(s);
    });

    setSepW(sep.offsetWidth);
    setEmailWidths(spans.map((s) => s.offsetWidth));
  }, [normalized]);

  // edge: empty (no email)
  if (normalized.length === 0) {
    return (
      <div className="email-cell" ref={outerRef}>
        –
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fitCount = useMemo(() => {
    if (!containerW || emailWidths.length === 0) return 0;
    return computeFitCount(emailWidths, sepW, containerW);
  }, [containerW, emailWidths, sepW]);

  const fullList = normalized.join(", ");
  const renderMultiFit = fitCount >= 2;
  const overflow = Math.max(0, normalized.length - fitCount);

  // helper: keyboard toggle tooltip (3)
  const onBadgeKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowTooltip((v) => !v);
    }
  };

  return (
    <Fragment>
      {/* Hidden measurement host */}
      <div className="measure-host" aria-hidden ref={measureRef} />

      <div className="email-cell" ref={outerRef}>
        {renderMultiFit ? (
          <>
            <div className="emails-inline no-wrap">
              {normalized.slice(0, fitCount).map((e, i, arr) => (
                <span key={i} className="email-text">
                  {e}
                  {i < arr.length - 1 ? (
                    <span className="sep">{", "}</span>
                  ) : null}
                </span>
              ))}
            </div>

            {overflow > 0 && (
              <div
                className="badge"
                role="button"
                tabIndex={0} // (1) keyboard focus
                aria-label={`Show ${overflow} more recipients`}
                title={fullList}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)} // (1) show on focus
                onBlur={() => setShowTooltip(false)} // (1) hide on blur
                onKeyDown={onBadgeKeyDown} // (1) enter/space toggle
              >
                +{overflow}
                <div
                  className={`tooltip ${showTooltip ? "show" : ""}`}
                  role="tooltip"
                >
                  {fullList}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="single-wrap">
            <span className="single-ellipsis email-text" title={normalized[0]}>
              {normalized[0]}
            </span>

            {normalized.length > 1 && (
              <div
                className="badge"
                role="button"
                tabIndex={0} // (1)
                aria-label={`Show ${normalized.length - 1} more recipients`}
                title={fullList}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)} // (1)
                onBlur={() => setShowTooltip(false)} // (1)
                onKeyDown={onBadgeKeyDown} // (1)
              >
                +{normalized.length - 1}
                <div
                  className={`tooltip ${showTooltip ? "show" : ""}`}
                  role="tooltip"
                >
                  {fullList}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
};
