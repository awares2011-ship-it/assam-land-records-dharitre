type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, icon }: Props) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        {icon ? (
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 grid place-items-center">
            {icon}
          </div>
        ) : null}
        <div>
          <h1 className="text-xl font-semibold text-slate-900 leading-tight">{title}</h1>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
}
