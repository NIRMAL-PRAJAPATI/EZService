import ThemeSwitcher from '../../ThemeSwitcher';

// Same two-column section layout as the other profile sections.
export default function Appearance() {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6 mt-10 sm:mt-0">
      <div className="md:col-span-1 px-4 sm:px-0">
        <h3 className="text-xl font-medium text-gray-900">Appearance</h3>
        <p className="mt-1 text-gray-600">Choose a light or dark look. System follows your phone or computer setting.</p>
      </div>
      <div className="mt-5 md:col-span-2 md:mt-0">
        <div className="bg-white px-4 py-5 shadow sm:p-6 sm:rounded-lg">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
