const landedCalculator = document.querySelector("[data-landed-calculator]");

if (landedCalculator) {
  const form = landedCalculator.querySelector("[data-calculator-form]");
  const output = {
    perUnit: landedCalculator.querySelector("[data-cost-per-unit]"),
    goods: landedCalculator.querySelector("[data-cost-goods]"),
    logistics: landedCalculator.querySelector("[data-cost-logistics]"),
    duty: landedCalculator.querySelector("[data-cost-duty]"),
    controls: landedCalculator.querySelector("[data-cost-controls]"),
    contingency: landedCalculator.querySelector("[data-cost-contingency]"),
    total: landedCalculator.querySelector("[data-cost-total]"),
    saleableUnits: landedCalculator.querySelector("[data-saleable-units]"),
    note: landedCalculator.querySelector("[data-calculator-note]"),
  };
  const number = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function readValue(name) {
    const value = Number(new FormData(form).get(name));
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  function calculate() {
    const units = Math.max(1, readValue("units"));
    const goods = readValue("goods");
    const freight = readValue("freight");
    const insurance = readValue("insurance");
    const dutyRate = readValue("dutyRate") / 100;
    const importTax = readValue("importTax");
    const inspection = readValue("inspection");
    const other = readValue("other");
    const contingencyRate = readValue("contingencyRate") / 100;
    const rejectRate = Math.min(0.99, readValue("rejectRate") / 100);

    const logistics = freight + insurance;
    const customsBase = goods + logistics;
    const duty = customsBase * dutyRate;
    const controls = importTax + inspection + other;
    const subtotal = customsBase + duty + controls;
    const contingency = subtotal * contingencyRate;
    const total = subtotal + contingency;
    const saleableUnits = Math.max(1, units * (1 - rejectRate));
    const perUnit = total / saleableUnits;

    output.perUnit.textContent = number.format(perUnit);
    output.goods.textContent = number.format(goods);
    output.logistics.textContent = number.format(logistics);
    output.duty.textContent = number.format(duty);
    output.controls.textContent = number.format(controls);
    output.contingency.textContent = number.format(contingency);
    output.total.textContent = number.format(total);
    output.saleableUnits.textContent = whole.format(saleableUnits);
    output.note.textContent = rejectRate > 0.15
      ? "A high reject assumption materially changes unit cost. Validate the inspection standard, defect definition, and recovery terms."
      : "Check the HS classification, customs valuation, Incoterm, tax treatment, and quote inclusions before relying on this estimate.";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });

  form.addEventListener("input", calculate);
  calculate();
}
