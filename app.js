const demoData = {
  pearl: {
    name: "Pearl River Mfg.",
    source: "Direct outreach",
    score: 82,
    status: "Strong candidate",
    complete: "100%",
    risks: "0",
    lead: "28 days",
    action: "Confirm the production sample, final beneficiary, contract terms, and landed cost before payment.",
    checks: {
      legal: ["verified", "Verified"],
      beneficiary: ["verified", "Verified"],
      documents: ["verified", "Verified"],
      sample: ["verified", "Verified"],
      terms: ["verified", "Verified"],
    },
  },
  harbor: {
    name: "Harbor Trade Co.",
    source: "Marketplace lead",
    score: 68,
    status: "Verify further",
    complete: "83%",
    risks: "2",
    lead: "21 days",
    action: "Confirm the beneficiary relationship and obtain the complete product test report before shortlisting.",
    checks: {
      legal: ["verified", "Verified"],
      beneficiary: ["pending", "Pending"],
      documents: ["pending", "Pending"],
      sample: ["verified", "Verified"],
      terms: ["verified", "Verified"],
    },
  },
  fast: {
    name: "FastSource Ltd.",
    source: "Unsolicited quote",
    score: 47,
    status: "High risk",
    complete: "58%",
    risks: "5",
    lead: "14 days",
    action: "Pause. Verify the legal entity and payment beneficiary independently, then compare stronger alternatives.",
    checks: {
      legal: ["pending", "Pending"],
      beneficiary: ["missing", "Mismatch"],
      documents: ["missing", "Missing"],
      sample: ["pending", "Not tested"],
      terms: ["pending", "Incomplete"],
    },
  },
};

const lab = document.querySelector("[data-decision-lab]");

if (lab) {
  const tabs = [...lab.querySelectorAll("[data-supplier]")];
  const runButton = lab.querySelector("[data-run-audit]");
  const name = lab.querySelector("[data-demo-name]");
  const source = lab.querySelector("[data-demo-source]");
  const score = lab.querySelector("[data-score]");
  const scoreRing = lab.querySelector("[data-score-ring]");
  const status = lab.querySelector("[data-demo-status]");
  const complete = lab.querySelector("[data-demo-complete]");
  const risks = lab.querySelector("[data-demo-risks]");
  const lead = lab.querySelector("[data-demo-lead]");
  const action = lab.querySelector("[data-demo-action]");
  const checkRows = [...lab.querySelectorAll("[data-check]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let auditTimers = [];

  function animateScore(nextScore) {
    score.textContent = String(nextScore);
  }

  function showSupplier(key) {
    const data = demoData[key];
    if (!data) return;

    tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.supplier === key)));
    name.textContent = data.name;
    source.textContent = data.source;
    status.textContent = data.status;
    complete.textContent = data.complete;
    risks.textContent = data.risks;
    lead.textContent = data.lead;
    action.textContent = data.action;
    scoreRing.style.setProperty("--score", data.score);
    animateScore(data.score);

    checkRows.forEach((row, index) => {
      const [state, label] = data.checks[row.dataset.check];
      const apply = () => {
        row.dataset.state = state;
        row.querySelector("strong").textContent = label;
      };
      if (reducedMotion) apply();
      else window.setTimeout(apply, index * 65);
    });
  }

  function stopAudit() {
    auditTimers.forEach(window.clearTimeout);
    auditTimers = [];
    lab.classList.remove("is-scanning");
    runButton.removeAttribute("aria-busy");
    runButton.lastChild.textContent = " Run sample audit";
  }

  function runAudit() {
    stopAudit();
    lab.classList.add("is-scanning");
    runButton.setAttribute("aria-busy", "true");
    runButton.lastChild.textContent = " Scanning evidence…";

    const sequence = reducedMotion
      ? [[0, "fast"], [0, "harbor"], [0, "pearl"]]
      : [[180, "fast"], [950, "harbor"], [1720, "pearl"]];

    sequence.forEach(([delay, key]) => {
      auditTimers.push(window.setTimeout(() => showSupplier(key), delay));
    });
    auditTimers.push(window.setTimeout(stopAudit, reducedMotion ? 80 : 2520));
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      stopAudit();
      showSupplier(tab.dataset.supplier);
    });
  });
  runButton.addEventListener("click", runAudit);
}

const depositGate = document.querySelector("[data-deposit-gate]");

if (depositGate) {
  const form = depositGate.querySelector("[data-gate-form]");
  const checks = [...depositGate.querySelectorAll("[data-gate-check]")];
  const progress = depositGate.querySelector("[data-gate-progress]");
  const count = depositGate.querySelector("[data-gate-count]");
  const result = depositGate.querySelector("[data-gate-result]");
  const verdict = depositGate.querySelector("[data-gate-verdict]");
  const summary = depositGate.querySelector("[data-gate-summary]");
  const cleared = depositGate.querySelector("[data-gate-cleared]");
  const open = depositGate.querySelector("[data-gate-open]");
  const next = depositGate.querySelector("[data-gate-next]");
  const date = depositGate.querySelector("[data-gate-date]");

  const checkNames = {
    legal: "legal entity evidence",
    beneficiary: "bank beneficiary relationship",
    product: "product-specific evidence",
    compliance: "destination-market compliance",
    terms: "written commercial terms",
  };

  date.textContent = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  function selectedCount() {
    return checks.filter((item) => item.checked).length;
  }

  function updateProgress() {
    const total = selectedCount();
    count.textContent = String(total);
    progress.style.width = `${(total / checks.length) * 100}%`;
  }

  function generateDecision() {
    const total = selectedCount();
    const remaining = checks.length - total;
    const firstOpen = checks.find((item) => !item.checked);

    result.classList.remove("is-stamped");
    void result.offsetWidth;
    result.classList.add("is-stamped");
    cleared.textContent = `${total} / ${checks.length}`;
    open.textContent = String(remaining);

    if (total === checks.length) {
      result.dataset.state = "ready";
      verdict.textContent = "READY";
      summary.textContent = "All five evidence gates are recorded. Complete your final contract, sample, and payment-instruction checks before sending funds.";
      next.textContent = "Save the supporting evidence and final decision in one review file.";
      return;
    }

    if (total >= 2) {
      result.dataset.state = "review";
      verdict.textContent = "REVIEW";
      summary.textContent = `${remaining} evidence gate${remaining === 1 ? " remains" : "s remain"} unresolved. Do not treat a platform badge or low quote as a substitute.`;
      next.textContent = `Resolve the ${checkNames[firstOpen.name]} before approving a deposit.`;
      return;
    }

    result.dataset.state = "hold";
    verdict.textContent = "HOLD";
    summary.textContent = "The evidence file is too incomplete for a controlled deposit decision.";
    next.textContent = firstOpen
      ? `Start with the ${checkNames[firstOpen.name]}.`
      : "Start with the supplier's legal entity and intended bank beneficiary.";
  }

  checks.forEach((item) => item.addEventListener("change", updateProgress));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateProgress();
    generateDecision();
  });
}
