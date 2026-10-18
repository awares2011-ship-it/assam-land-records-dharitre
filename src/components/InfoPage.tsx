import PageHeader from './PageHeader';
import OfficialLink from './OfficialLink';
import Disclaimer from './Disclaimer';

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  intro?: string;
  sections: { heading: string; items: string[] }[];
  links?: { label: string; url: string }[];
};

export default function InfoPage({ title, subtitle, icon, intro, sections, links = [] }: Props) {
  return (
    <div className="space-y-4">
      <PageHeader title={title} subtitle={subtitle} icon={icon} />
      {intro && (
        <section className="m3-card p-4 text-sm leading-relaxed text-slate-700">{intro}</section>
      )}
      {sections.map((s, i) => (
        <section key={i} className="m3-card p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">{s.heading}</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
            {s.items.map((x, j) => <li key={j}>{x}</li>)}
          </ul>
        </section>
      ))}
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((l) => <OfficialLink key={l.url} url={l.url} label={l.label} variant="ghost" />)}
        </div>
      )}
      <Disclaimer />
    </div>
  );
}
