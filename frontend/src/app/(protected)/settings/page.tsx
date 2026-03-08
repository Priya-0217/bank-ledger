export default function SettingsPage() {
  const items = [
    'Two-Factor Authentication',
    'API Key Access',
    'Biometric Login',
    'Login Notifications',
    'IP Whitelisting'
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header>
        <h1 className="text-4xl font-semibold text-white">Settings</h1>
        <p className="text-slate-400">Manage your account and security preferences</p>
      </header>

      <section className="vault-card p-6">
        <h2 className="text-2xl font-semibold text-white">Profile</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="vault-input" defaultValue="John Doe" />
          <input className="vault-input" defaultValue="john@vault.com" />
          <input className="vault-input" defaultValue="+1 (555) 123-4567" />
          <input className="vault-input" defaultValue="UTC-5 (EST)" />
        </div>
        <button className="vault-primary-btn mt-4">Save Changes</button>
      </section>

      <section className="vault-card p-6">
        <h2 className="text-2xl font-semibold text-white">Security</h2>
        <div className="mt-4 space-y-3">
          {items.map((item, idx) => (
            <div key={item} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <p className="text-slate-200">{item}</p>
              <span className={`h-6 w-11 rounded-full ${idx % 2 === 0 ? 'bg-emerald-400/90' : 'bg-white/20'}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="vault-card border border-rose-500/30 p-6">
        <h2 className="text-2xl font-semibold text-rose-400">Danger Zone</h2>
        <p className="mt-1 text-slate-400">Irreversible actions on your account</p>
        <div className="mt-4 flex gap-2">
          <button className="vault-secondary-btn border-rose-500/40 text-rose-300">Close Account</button>
          <button className="vault-secondary-btn">Export All Data</button>
        </div>
      </section>
    </div>
  )
}
