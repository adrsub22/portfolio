import Image from "next/image";

const kpis = [
  { value: "37", label: "dbt models" },
  { value: "215", label: "dbt tests" },
  { value: "167", label: "pytest tests" },
  { value: "375", label: "database DQ checks" },
  { value: "0", label: "control vs dbt differences" },
];

const figures = [
  {
    src: "/ecommerce-analytics/customer_segment_value.png",
    alt: "Grouped bars comparing customer share and sales share by RFM segment. Champions are a small share of customers and about half of sales.",
    width: 1778,
    height: 1062,
    title: "Customer segment value composition",
    takeaway:
      "Champions were 16.2% of customers and 49.8% of sales. Champions plus Loyal Customers were 25.2% of customers and 65.9% of sales. RFM is a descriptive snapshot, not a churn prediction.",
  },
  {
    src: "/ecommerce-analytics/second_purchase_curve.png",
    alt: "Line chart of maturity-adjusted second-purchase rates at 30, 60, 90, 180, and 365 days from first purchase.",
    width: 1600,
    height: 881,
    title: "Maturity-adjusted second-purchase curve",
    takeaway:
      "Eligible second-purchase rates rose from 17.9% at 30 days to 72.5% at 365 days. Of 3,808 customers eligible for a 90-day window, 38.1% repeated within 90 days and accounted for 60.4% of that group’s current sales — an association, not a causal claim.",
  },
  {
    src: "/ecommerce-analytics/product_sales_margin.png",
    alt: "Scatter plot of product net merchandise sales on a log scale versus gross margin, colored by category, with reference lines for typical sales and margin.",
    width: 1783,
    height: 1060,
    title: "Product sales versus gross margin",
    takeaway:
      "High sales split into different profit economics. The high-sales / low-margin group generated $3.421M at 28.6% margin, versus 48.3% margin for the high-sales / high-margin group.",
  },
  {
    src: "/ecommerce-analytics/category_commercial_value.png",
    alt: "Side-by-side bar charts of net merchandise sales and gross profit by product category, led by Electronics, Home and Kitchen, and Sports and Outdoors.",
    width: 2499,
    height: 880,
    title: "Category sales and gross profit",
    takeaway:
      "Electronics, Home & Kitchen, and Sports & Outdoors contributed 70.5% of sales. Concentration is stronger at category level than among a handful of SKUs.",
  },
];

export function EcommerceAnalytics() {
  return (
    <div className="ecom-demo">
      <p className="kicker">Portfolio analysis · synthetic data</p>
      <h3>Selected analytical outcomes</h3>
      <p className="muted">
        Headline figures come from the documented starter-scale dataset: 23,596
        successful orders, $7.394M net merchandise sales, 38.18% gross margin,
        and 5,000 simulated customers. They describe this warehouse, not a real
        company.
      </p>

      <div className="kpi-row kpi-row-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi">
            <b>{kpi.value}</b>
            <span className="muted">{kpi.label}</span>
          </div>
        ))}
      </div>
      <p className="muted ecom-kpi-note">
        Exact side-by-side parity was achieved across all migrated dimensions,
        facts, and governed marts.
      </p>

      {figures.map((figure) => (
        <figure key={figure.src} className="ecom-figure">
          <figcaption>
            <strong>{figure.title}</strong>
            <span>{figure.takeaway}</span>
          </figcaption>
          <Image
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            unoptimized
            className="ecom-figure-img"
          />
        </figure>
      ))}

      <div className="ecom-lineage">
        <h3>dbt lineage in practice</h3>
        <p className="muted">
          Representative dbt lineage views show how governed business logic
          moves from staged source data through dimensional and fact models
          into analytical marts.
        </p>
        <figure className="ecom-figure">
          <figcaption>
            <strong>Product Performance Mart</strong>
            <span>
              Product performance combines successful order-item activity with
              product hierarchy, completed-return context, and reviews
              attributed to their original purchase cohorts.
            </span>
          </figcaption>
          <Image
            src="/ecommerce-analytics/dbt-product-monthly-lineage.png"
            alt="dbt Docs lineage graph for mart_product_monthly, flowing from core product and category sources through staging, dimensions, facts, and intermediate models into the monthly product mart."
            width={1911}
            height={815}
            unoptimized
            className="ecom-figure-img ecom-lineage-img"
          />
        </figure>
        <figure className="ecom-figure">
          <figcaption>
            <strong>Customer Cohort Mart</strong>
            <span>
              Customer cohort modeling traces governed customer and
              successful-order activity into acquisition-based retention
              analysis while preserving observable-period logic.
            </span>
          </figcaption>
          <Image
            src="/ecommerce-analytics/dbt-customer-cohort-lineage.png"
            alt="dbt Docs lineage graph for mart_customer_cohort, flowing from staged customer data through dimensions, facts, intermediate models, and customer summary into the cohort mart."
            width={1911}
            height={815}
            unoptimized
            className="ecom-figure-img ecom-lineage-img"
          />
        </figure>
      </div>
    </div>
  );
}
