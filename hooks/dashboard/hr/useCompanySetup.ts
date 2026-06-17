import { useState } from "react";
import { Company } from "@/types/company";
import { apiFetch } from "@/lib/api";
import { CompanyForm, CompanySize, Industry } from "@/types/hr/dashboard";



export function useCompanySetup({
  token,
  onDone,
}: {
  token: string;
  onDone: (c: Company) => void;
}) {
  const [form, setForm] = useState<CompanyForm>({
    name: "",
    description: "",
    company_size: "",
    industry: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (): Promise<void> => {
    if (!form.name.trim()) return setError("Nama perusahaan wajib diisi");
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/companies/create", token, {
        method: "POST",
        body: JSON.stringify(form),
      });
      onDone(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan yang tidak diketahui.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setForm((prev) => ({
      ...prev,
      description: e.target.value.slice(0, 200),
    }));
  };

  const handleIndustryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setForm((prev) => ({ ...prev, industry: e.target.value as Industry }));
  };

  const handleSizeSelect = (size: CompanySize): void => {
    setForm((prev) => ({ ...prev, company_size: size }));
  };

  return {
    form,
    loading,
    error,
    handleSubmit,
    handleNameChange,
    handleDescriptionChange,
    handleIndustryChange,
    handleSizeSelect,
  };
}
