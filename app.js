const fields = [
  ["casino", "Casino"],
  ["welcome_bonus", "Welcome bonus"],
  ["wagering_requirement", "Wagering requirement"],
  ["minimum_deposit", "Minimum deposit"],
];

function textCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "Not stated on source page";
  return cell;
}

async function loadOffers() {
  const tbody = document.getElementById("offers");
  const status = document.getElementById("status");

  try {
    // This project stores bonuses.json in the repository root beside app.js.
    const response = await fetch("bonuses.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load data (HTTP ${response.status}).`);
    }

    const data = await response.json();
    if (!Array.isArray(data.offers) || data.offers.length !== 3) {
      throw new Error("Expected exactly three offers in bonuses.json.");
    }

    tbody.replaceChildren();
    for (const offer of data.offers) {
      const row = document.createElement("tr");
      for (const [key, label] of fields) {
        const cell = textCell(offer[key]);
        cell.dataset.label = label;
        row.append(cell);
      }

      const sourceCell = document.createElement("td");
      sourceCell.dataset.label = "Source";
      const link = document.createElement("a");
      link.href = offer.source_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "View source";
      sourceCell.append(link);
      row.append(sourceCell);
      tbody.append(row);
    }

    const date = new Date(data.generated_at);
    document.getElementById("updated").textContent =
      `Data generated ${Number.isNaN(date.getTime()) ? "recently" : date.toLocaleString()}`;
  } catch (error) {
    tbody.replaceChildren();
    status.textContent = `${error.message} Check that bonuses.json is beside app.js.`;
    document.getElementById("updated").textContent = "Data unavailable";
  }
}

loadOffers();
