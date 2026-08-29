import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { patchSettings, testExtraction } from '../../services/authService';
import { Button } from '../ui/Button';
import { Eye, EyeOff } from 'lucide-react';

const PROVIDERS = [
  { id: 'groq',    label: 'Groq (Llama 3.3 70B)',    desc: 'Fastest • Free tier',  keyName: 'Groq API Key', requiresKey: true },
  { id: 'zhipu',   label: 'Z.ai GLM-4 Flash',         desc: 'ZhipuAI • Fast',       keyName: 'Zhipu API Key', requiresKey: true },
  { id: 'gemini',  label: 'Google Gemini 1.5 Flash',  desc: 'Google • Free tier',   keyName: 'Gemini API Key', requiresKey: true },
  { id: 'mistral', label: 'Mistral Small',             desc: 'Mistral AI • Free',    keyName: 'Mistral API Key', requiresKey: true },
  { id: 'ollama',  label: 'Ollama (Local)',             desc: 'Self-hosted • No key', keyName: '', requiresKey: false },
];

export function AIProviderSettings() {
  const { user, accessToken, updateUser } = useAuthStore();
  const { aiProvider, setAiProvider } = useSettingsStore();
  const [testing, setTesting] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savingKeys, setSavingKeys] = useState(false);

  const saveProvider = async (provider: string) => {
    setAiProvider(provider);
    if (!accessToken) return;
    try {
      const res = await patchSettings(accessToken, { aiProvider: provider });
      updateUser(res.settings);
      toast.success('AI provider updated');
    } catch {
      toast.error('Failed to update provider');
    }
  };

  const handleKeyChange = (providerId: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [providerId]: value }));
  };

  const saveKeys = async () => {
    if (!accessToken) return;
    setSavingKeys(true);
    try {
      const res = await patchSettings(accessToken, { apiKeys });
      updateUser(res.settings);
      toast.success('API keys saved');
    } catch {
      toast.error('Failed to save API keys');
    } finally {
      setSavingKeys(false);
    }
  };

  const test = async (providerId?: string) => {
    if (!accessToken) return;
    setTesting(true);
    try {
      await testExtraction(accessToken, providerId || aiProvider);
      toast.success(`Test extraction succeeded!`);
    } catch {
      toast.error('Test failed — check API key for this provider');
    } finally {
      setTesting(false);
    }
  };

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-1">AI Provider</h3>
        <p className="text-xs text-[#9ca3af]">
          Select your primary provider and configure your API keys. If a key is missing, the global fallback key (if set on the server) will be used.
        </p>
      </div>

      <div className="space-y-4">
        {PROVIDERS.map((p) => (
          <div
            key={p.id}
            className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors ${
              aiProvider === p.id
                ? 'border-accent bg-[#eff6ff]'
                : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db]'
            }`}
          >
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => saveProvider(p.id)}>
              <input
                type="radio"
                name="provider"
                checked={aiProvider === p.id}
                onChange={() => {}} // handled by div click
                className="mt-0.5 accent-accent"
              />
              <div className="flex-1">
                <p className={`text-sm font-semibold ${aiProvider === p.id ? 'text-accent' : 'text-[#111827]'}`}>
                  {p.label}
                </p>
                <p className="text-xs text-[#9ca3af] mt-0.5">{p.desc}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); test(p.id); }} disabled={testing}>
                Test
              </Button>
            </div>

            {p.requiresKey && (
              <div className="pl-7 pr-1 mt-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {p.keyName} (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showKeys[p.id] ? 'text' : 'password'}
                    className="block w-full rounded-md border-gray-300 pr-10 text-sm shadow-sm focus:border-accent focus:ring-accent"
                    placeholder={user?.apiKeyConfigured[p.id] ? 'Key configured — enter a new value to replace' : 'Enter your API key'}
                    value={apiKeys[p.id] || ''}
                    onChange={(e) => handleKeyChange(p.id, e.target.value)}
                    onBlur={saveKeys}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(p.id)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys[p.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {user?.apiKeyConfigured[p.id] && !apiKeys[p.id] && (
                  <p className="mt-1 text-xs text-emerald-600">A key is securely configured.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.values(apiKeys).some((k) => k?.trim()) && (
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={saveKeys} disabled={savingKeys}>
            {savingKeys ? 'Saving...' : 'Save API Keys'}
          </Button>
        </div>
      )}
    </div>
  );
}
