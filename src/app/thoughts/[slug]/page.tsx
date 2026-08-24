import { notFound } from "next/navigation";
import { posts } from "@/data/thoughts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return { title: post?.title ?? "Note" };
}

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <p className="kicker">Thoughts</p>
      <h1>{post.title}</h1>
      <p className="lede thought-subtitle">{post.subtitle}</p>
      <div className="tags thought-tags">
        {post.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <article className="thought-body">
        <p>
          A paratransit agency I worked with runs weekly productivity reporting
          on top of their scheduling and dispatch platform—one row per driver
          run per day, 29 columns, going back years. It&apos;s a Python notebook
          reading from the vendor&apos;s tables. Then, mid-year, the agency
          replaced that vendor with a new platform. The notebook stopped
          working. The report still had to go out.
        </p>
        <p>
          That&apos;s the surface problem. The interesting one is what
          &quot;the same report&quot; even means when the underlying system has
          changed.
        </p>

        <h2>Same names, different measurements</h2>
        <p>
          The new vendor divides a driver&apos;s shift into different
          categories than the old one did. A lot of the column names carried
          over—<code>ServiceHours</code>, <code>DeadHeadHours</code>,{" "}
          <code>SlackHours</code>—but the numbers behind them shifted, and in
          one case dramatically.
        </p>
        <p>
          The new platform&apos;s <code>DeadHeadHours</code> came out to{" "}
          <strong>4.7% of on-duty time</strong>. The old one had been running at{" "}
          <strong>13.6%</strong>. That&apos;s the kind of gap that makes ops
          distrust the whole report, so I had to figure out where the time went
          before shipping anything.
        </p>
        <p>
          It turned out the new vendor only records one leg of deadhead—the
          drive back to the depot at end of shift. The drive <em>out</em> to the
          first pickup, which the old system had labelled as deadhead, was
          sitting inside <code>SlackHours</code> instead. Two legs, same total
          driving, different bucket. So the &quot;gap&quot; was mostly a
          labelling change:
        </p>
        <pre>
          <code>{`-- pull-out leg reconstructed from the vendor's own state timers
CAST(
    ISNULL(first_accept_deadhead_time,  0)
  + ISNULL(first_arrival_deadhead_time, 0)
  AS decimal(10,4)
) / 3600.0 AS PullOutHours`}</code>
        </pre>
        <p>
          Adding pull-out back in brought deadhead to 11.1%—still not quite
          13.6%, and the remainder turned out to be stationary post-service time
          (drivers still logged on after their last dropoff with the vehicle
          parked). That last piece became an ops decision rather than a
          technical one, so I documented it as three options with the
          trade-offs and left it to them to choose.
        </p>

        <h2>Two identities that had to hold</h2>
        <p>
          The whole thing lives or dies on reconciliation. Every hour and mile
          the vendor records has to land somewhere in the report and add up:
        </p>
        <pre>
          <code>{`TotalHours = ServiceHours + DeadHeadHours + SlackHours
           + BreakHours   + LunchHours    + RefuelHours + OtherHours

TotalMiles = ServiceMiles + DeadHeadMiles + SlackMiles + Blo`}</code>
        </pre>
        <p>
          If either of these breaks by more than a rounding error, something&apos;s
          wrong with the data, not the formula. I built those checks into the
          query so a bad day surfaces immediately instead of quietly filing.
        </p>

        <h2>Reconciling to the vendor&apos;s own report</h2>
        <p>
          The new platform publishes a Provider NTD dashboard—the same figures
          the agency files to the Federal Transit Administration. So I wrote a
          second query that rolls the productivity report up to provider-day and
          compares against it:
        </p>
        <pre>
          <code>{`SELECT
    Provider,
    Date,
    SUM(ServiceHours + SlackHours)              AS RevenueHoursExclLayover,
    SUM(ServiceHours + SlackHours + OtherHours) AS RevenueHours,
    SUM(ServiceHours)                           AS DR_RevenueHours,
    SUM(ServiceMiles)                           AS RevenueMiles,
    SUM(SlackMiles + Blo)                       AS OffFareMiles,
    SUM(ServiceMiles + SlackMiles + Blo)        AS ServiceMiles,
    SUM(PassengerMiles)                         AS PassengerMiles
FROM dbo.ProductivityReport
GROUP BY Provider, Date;`}</code>
        </pre>
        <p>
          All nine columns match the vendor&apos;s dashboard across the sample
          week. The largest disagreement is 0.006 hours on a day with roughly
          130 runs—three-decimal rounding, not a real gap.
        </p>

        <h2>What shipped</h2>
        <ul>
          <li>
            The productivity report—37 columns, verified against the vendor&apos;s
            own dashboard on nine NTD figures and against the legacy report on
            34 days / 6,498 runs across all providers.
          </li>
          <li>
            An NTD parity query, separate from the report, that reproduces the
            vendor&apos;s dashboard from the same tables—an independent way to
            defend a number if it&apos;s ever questioned.
          </li>
          <li>
            Five ops-facing documents: a plain-language glossary, a one-page
            calculation reference, a deadhead decision handout, the parity
            dictionary, and an open-issues list.
          </li>
        </ul>
        <p>
          The most useful realization on the documentation side was that
          I&apos;d been mixing three things—definitions, formulas, and
          stuff-we&apos;re-still-figuring-out—into a single eight-page Word doc,
          and ops was getting stuck on the &quot;still figuring out&quot; parts.
          Pulling each into its own file made all of them shorter, and only one
          of them has to change week to week.
        </p>
      </article>
    </>
  );
}
