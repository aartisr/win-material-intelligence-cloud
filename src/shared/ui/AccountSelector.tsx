import type { Account } from "../../types";

export function AccountSelector({
  accounts,
  value,
  onChange,
}: {
  accounts: Account[];
  value: string;
  onChange: (accountId: string) => void;
}) {
  return (
    <label className="select-field">
      Account
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">All accounts</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
    </label>
  );
}
