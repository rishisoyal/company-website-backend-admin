
type Props = {
  title: string;
  data: string;
};

export default function AnalyticsCard({ title, data }: Props) {
  return (
    <>
      <div className="card bg-[#181825] border-4 border-black text-2xl rounded-xl min-w-40 w-full p-6">
        <h2 className="text-white">{title}</h2>
        <p className="text-white">{data}</p>
      </div>
    </>
  );
}
