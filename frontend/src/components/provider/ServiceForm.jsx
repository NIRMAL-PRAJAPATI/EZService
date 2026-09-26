import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ImagePlus, X, Plus, IndianRupee, Zap, MapPin, ListChecks, Camera } from 'lucide-react';
import OutlinedField from '../ui/OutlinedField';
import Button from '../ui/Button';
import { InlineError } from '../ui/States';
import Switch from '../ui/Switch';
import { getCategoryIcon } from '../../lib/categories';
import { lockScroll } from '../../lib/scrollLock';

const EXPERIENCE = [
  { value: '1', label: '1+ year' },
  { value: '3', label: '3+ years' },
  { value: '5', label: '5+ years' },
  { value: '10', label: '10+ years' },
];

/**
 * Full-screen "Add new service" / "Edit service" form for providers.
 * onSave(serviceData) must return a promise; the form stays open (and shows
 * the error) if saving fails, and closes when it succeeds.
 */
export default function ServiceForm({ open, onClose, service, categories = [], onSave }) {
  const isEdit = !!service?.id;
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [visitingCharge, setVisitingCharge] = useState('');
  const [instantCharge, setInstantCharge] = useState('');
  const [experience, setExperience] = useState('');
  const [areas, setAreas] = useState([]);
  const [included, setIncluded] = useState([]);
  const [description, setDescription] = useState('');
  const [instantEnabled, setInstantEnabled] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [workingImages, setWorkingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(service?.name || '');
    setCategoryId(service?.category_id ? String(service.category_id) : '');
    setVisitingCharge(service?.visitingCharge ? String(service.visitingCharge) : '');
    setInstantCharge(service?.instantServiceCharge ? String(service.instantServiceCharge) : '');
    setExperience(service?.experience ? String(service.experience) : '');
    setAreas((service?.serviceLocations || []).filter(Boolean));
    setIncluded((service?.providedServices || []).filter(Boolean));
    setDescription(service?.description || '');
    setInstantEnabled(service ? service.instantEnabled !== false : true);
    setIsActive(service ? service.isActive !== false : true);
    setCoverImage(null);
    setWorkingImages([]);
    setErrors({});
    setSaveError('');
    setSaving(false);
  }, [open, service]);

  // Lock the page behind the form
  useEffect(() => {
    if (!open) return undefined;
    return lockScroll();
  }, [open]);

  const coverPreview = useMemo(() => (coverImage ? URL.createObjectURL(coverImage) : null), [coverImage]);
  const workPreviews = useMemo(() => workingImages.map((f) => URL.createObjectURL(f)), [workingImages]);
  useEffect(() => () => coverPreview && URL.revokeObjectURL(coverPreview), [coverPreview]);
  useEffect(() => () => workPreviews.forEach((u) => URL.revokeObjectURL(u)), [workPreviews]);

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!categoryId) e.category = 'Choose a category.';
    if (name.trim().length < 3) e.name = 'Enter a service name (at least 3 characters).';
    if (!(Number(visitingCharge) > 0)) e.visitingCharge = 'Enter your visiting charge.';
    if (instantCharge !== '' && Number(instantCharge) < 0) e.instantCharge = 'Charge cannot be negative.';
    if (!experience) e.experience = 'Choose your experience.';
    if (areas.length === 0) e.areas = 'Add at least one area you serve.';
    if (description.trim().length < 10) e.description = 'Describe the service in a few words (at least 10 characters).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    setSaveError('');
    if (!validate()) return;
    setSaving(true);
    Promise.resolve(
      onSave({
        id: service?.id,
        name: name.trim(),
        category_id: categoryId,
        visiting_charge: parseFloat(visitingCharge),
        instant_visiting_charge: parseFloat(instantCharge || 0),
        locations: areas,
        experience,
        specifications: included,
        working_images: workingImages,
        cover_image: coverImage,
        description: description.trim(),
        instant_enabled: instantEnabled,
        is_active: isActive,
        service_type: service?.service_type || 'HOME',
        badge_status: service?.badgeStatus || false,
        city: service?.city || '',
        state: service?.state || '',
        country: service?.country || '',
      })
    )
      .then(() => onClose())
      .catch((err) => setSaveError(err?.response?.data?.message || "We couldn't save this service. Please try again."))
      .finally(() => setSaving(false));
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] bg-black/40 sm:flex sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit service' : 'Add new service'}>
      <div className="flex h-full w-full flex-col bg-white sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:rounded-md sm:border sm:border-gray-200">
        {/* Header */}
        <header className="flex items-center gap-2 border-b border-gray-200 px-2 sm:px-4 h-14 shrink-0">
          <button type="button" onClick={onClose} className="h-11 w-11 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100" aria-label="Close">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold tracking-wide text-gray-900 truncate">{isEdit ? 'Edit service' : 'Add new service'}</h2>
            <p className="-mt-0.5 text-xs text-gray-500">{isEdit ? 'Update what customers see' : 'Customers will see this on your profile'}</p>
          </div>
        </header>

        {/* Body */}
        <form id="service-form" onSubmit={submit} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-8" noValidate>
          <Section title="Category" subtitle="What kind of work is this?">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Category">
              {categories.map((c) => {
                const Icon = getCategoryIcon(c.name);
                const active = String(c.id) === String(categoryId);
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setCategoryId(String(c.id))}
                    className={`h-12 px-3 rounded-sm border flex items-center gap-2 text-left text-sm font-medium ${
                      active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-indigo-600' : 'text-gray-400'}`} aria-hidden="true" />
                    <span className="leading-tight">{c.name}</span>
                  </button>
                );
              })}
            </div>
            <FieldError>{errors.category}</FieldError>
          </Section>

          <Section title="Service details" subtitle="Name it the way customers search for it.">
            <div className="space-y-5">
              <OutlinedField label="Service name" name="service-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tap & pipe repair" error={errors.name} />
              <OutlinedField
                as="textarea"
                rows={4}
                label="Description"
                name="service-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What do you do, what do you bring, how long does it usually take?"
                error={errors.description}
              />
            </div>
          </Section>

          <Section title="Pricing" subtitle="Your charge for coming to the customer's place.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <OutlinedField
                label="Visiting charge (₹)"
                icon={IndianRupee}
                name="visiting-charge"
                type="number"
                inputMode="numeric"
                min="0"
                value={visitingCharge}
                onChange={(e) => setVisitingCharge(e.target.value)}
                placeholder="e.g. 299"
                error={errors.visitingCharge}
              />
              <OutlinedField
                label="Instant visit charge (₹)"
                icon={Zap}
                name="instant-charge"
                type="number"
                inputMode="numeric"
                min="0"
                value={instantCharge}
                onChange={(e) => setInstantCharge(e.target.value)}
                placeholder="e.g. 399"
                error={errors.instantCharge}
                hint="Used as your default offer for instant requests."
              />
            </div>
          </Section>

          <Section title="Availability" subtitle="Where customers can find this service.">
            <div className="divide-y divide-gray-100 rounded-sm border border-gray-200">
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-gray-900 inline-flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-indigo-500" aria-hidden="true" /> Include in Instant Service
                  </p>
                  <p className="text-sm text-gray-500">Receive live requests for this service when you go online.</p>
                </div>
                <Switch checked={instantEnabled} onChange={setInstantEnabled} label="Include in Instant Service" />
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-gray-900">Active</p>
                  <p className="text-sm text-gray-500">Customers can see and book this service.</p>
                </div>
                <Switch checked={isActive} onChange={setIsActive} label="Active" />
              </div>
            </div>
          </Section>

          <Section title="Experience" subtitle="How long have you been doing this work?">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Experience">
              {EXPERIENCE.map((x) => (
                <button
                  key={x.value}
                  type="button"
                  role="radio"
                  aria-checked={experience === x.value}
                  onClick={() => setExperience(x.value)}
                  className={`h-10 px-4 rounded-sm border text-sm font-medium ${experience === x.value ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <FieldError>{errors.experience}</FieldError>
          </Section>

          <Section title="Service areas" subtitle="Cities or localities where you take bookings.">
            <TagInput icon={MapPin} label="Add an area" placeholder="e.g. Satellite, Ahmedabad" values={areas} onChange={setAreas} name="areas" />
            <FieldError>{errors.areas}</FieldError>
          </Section>

          <Section title="What's included" subtitle="Optional. List the jobs covered by this service.">
            <TagInput icon={ListChecks} label="Add an item" placeholder="e.g. Leak repair" values={included} onChange={setIncluded} name="included" />
          </Section>

          <Section title="Photos" subtitle="Good photos help customers trust you.">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Cover photo</p>
                <label className="relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-sm border-2 border-dashed border-gray-300 bg-gray-50 hover:border-indigo-400">
                  {coverPreview || service?.coverImage ? (
                    <>
                      <img src={coverPreview || service.coverImage} alt="Cover" className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-sm bg-white/95 px-2 py-1 text-xs font-medium text-gray-800">
                        <Camera className="h-3.5 w-3.5" aria-hidden="true" /> Change
                      </span>
                    </>
                  ) : (
                    <span className="flex flex-col items-center gap-1 text-sm text-gray-500">
                      <ImagePlus className="h-7 w-7 text-indigo-500" aria-hidden="true" />
                      Tap to add a cover photo
                    </span>
                  )}
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && setCoverImage(e.target.files[0])} />
                </label>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Work photos</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(service?.workingImages || []).map((src, i) => (
                    <img key={`old-${i}`} src={src} alt={`Existing work ${i + 1}`} className="aspect-square w-full rounded-sm object-cover border border-gray-200" />
                  ))}
                  {workPreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative">
                      <img src={src} alt={`New work ${i + 1}`} className="aspect-square w-full rounded-sm object-cover border border-indigo-300" />
                      <button
                        type="button"
                        onClick={() => setWorkingImages((list) => list.filter((_, idx) => idx !== i))}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center"
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-gray-300 bg-gray-50 text-xs text-gray-500 hover:border-indigo-400">
                    <Plus className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                    Add
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length) setWorkingImages((list) => [...list, ...files]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
                {isEdit && workingImages.length > 0 && (service?.workingImages || []).length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">New photos will be uploaded when you save.</p>
                )}
              </div>
            </div>
          </Section>

          <InlineError>{saveError}</InlineError>
        </form>

        {/* Footer */}
        <footer className="shrink-0 border-t border-gray-200 bg-white px-4 sm:px-6 py-3 bottom-safe">
          <div className="flex gap-2 sm:justify-end">
            <Button variant="secondary" onClick={onClose} className="flex-1 sm:flex-none" disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="service-form" loading={saving} className="flex-[2] sm:flex-none sm:px-8">
              {isEdit ? 'Save changes' : 'Add service'}
            </Button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="md:grid md:grid-cols-3 md:gap-6">
      <div className="mb-3 md:mb-0">
        <h3 className="text-base font-bold tracking-wide text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </section>
  );
}

function FieldError({ children }) {
  if (!children) return null;
  return (
    <p className="mt-2 text-xs text-red-600" role="alert">
      {children}
    </p>
  );
}

function TagInput({ label, placeholder, values, onChange, name, icon }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const add = () => {
    const parts = text
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => !values.some((v) => v.toLowerCase() === t.toLowerCase()));
    if (parts.length) onChange([...values, ...parts]);
    setText('');
    inputRef.current?.focus();
  };

  return (
    <div>
      <div className="flex gap-2">
        <OutlinedField
          ref={inputRef}
          label={label}
          icon={icon}
          name={name}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button variant="secondary" onClick={add} disabled={!text.trim()} className="h-[50px]">
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {values.map((v) => (
            <li key={v} className="inline-flex items-center gap-1 rounded-sm border border-indigo-200 bg-indigo-50 pl-2.5 pr-1 py-1 text-sm text-indigo-700">
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="h-6 w-6 rounded-sm hover:bg-indigo-100 flex items-center justify-center"
                aria-label={`Remove ${v}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
