import { RARITY_COLORS, RARITY_LABELS } from "../../../models/item/Item";
import type { WoodenCaseLootRow } from "../../../services/WoodenCaseService";
import { formatGold, formatPercent, formatQuantity } from "./format";

interface WoodenCaseLootTableProps {
  rows: WoodenCaseLootRow[];
}

const headerCellStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "0.72em",
  fontWeight: 700,
  color: "#546e7a",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  borderBottom: "2px solid #d0d7de",
  whiteSpace: "nowrap",
};

const cellStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: "0.9em",
  borderBottom: "1px solid #eceff1",
  whiteSpace: "nowrap",
};

const numericCellStyle: React.CSSProperties = {
  ...cellStyle,
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
};

export const WoodenCaseLootTable = ({ rows }: WoodenCaseLootTableProps) => (
  <div
    style={{
      width: "100%",
      background: "#fff",
      border: "1px solid #d0d7de",
      borderRadius: "8px",
      overflowX: "auto",
    }}
  >
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ ...headerCellStyle, textAlign: "left" }}>Item</th>
          <th style={{ ...headerCellStyle, textAlign: "left" }}>Rarity</th>
          <th style={{ ...headerCellStyle, textAlign: "right" }}>Drop chance</th>
          <th style={{ ...headerCellStyle, textAlign: "right" }}>Work / unit</th>
          <th style={{ ...headerCellStyle, textAlign: "right" }}>Quantity</th>
          <th style={{ ...headerCellStyle, textAlign: "right" }}>Avg qty</th>
          <th style={{ ...headerCellStyle, textAlign: "right" }}>Unit price</th>
          <th style={{ ...headerCellStyle, textAlign: "right" }}>Value if dropped</th>
          <th style={{ ...headerCellStyle, textAlign: "right" }}>Contribution</th>
          <th style={{ ...headerCellStyle, textAlign: "right" }}>Share</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.item.code}>
            <td style={{ ...cellStyle, textAlign: "left", fontWeight: 600 }}>
              {row.item.name}
            </td>
            <td style={{ ...cellStyle, textAlign: "left" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "0.8em",
                  fontWeight: 700,
                  color: "#fff",
                  background: RARITY_COLORS[row.item.rarity],
                }}
              >
                {RARITY_LABELS[row.item.rarity]}
              </span>
            </td>
            <td style={numericCellStyle}>{formatPercent(row.dropChance)}</td>
            <td style={numericCellStyle}>{row.item.productionPoints}</td>
            <td style={numericCellStyle}>
              {row.minQuantity === row.maxQuantity
                ? formatQuantity(row.minQuantity)
                : `${formatQuantity(row.minQuantity)} – ${formatQuantity(row.maxQuantity)}`}
            </td>
            <td style={numericCellStyle}>{row.expectedQuantity.toFixed(2)}</td>
            <td style={numericCellStyle}>{formatGold(row.unitPrice, 4)}</td>
            <td style={numericCellStyle}>{formatGold(row.expectedValue)}</td>
            <td style={{ ...numericCellStyle, fontWeight: 600 }}>
              {formatGold(row.contribution, 4)}
            </td>
            <td style={numericCellStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "6px",
                    borderRadius: "3px",
                    background: "#eceff1",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${row.contributionShare * 100}%`,
                      height: "100%",
                      background: RARITY_COLORS[row.item.rarity],
                    }}
                  />
                </div>
                {formatPercent(row.contributionShare, 1)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
