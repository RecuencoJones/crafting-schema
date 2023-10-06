import { saveAs } from 'file-saver';
import { table } from 'table';

export function collectMaterials(product, amount = 1, materials = new Map()) {
  product.recipe?.forEach(({ item, count }) => {
    if (item.recipe) {
      collectMaterials(item, count, materials);
    } else {
      materials.set(item.name, {
        item,
        count: (amount * count) + (materials.get(item.name)?.count || 0)
      });
    }
  });

  return materials;
}

export function toMaterialsTable(materials) {
  const lines = [];

  lines.push([ 'qty', 'name', 'type', 'grade', 'from' ]);

  for (const { item, count } of materials.values()) {
    lines.push([ count, item.name, item.type, item.grade, item.from?.join(', ') ]);
  }

  return lines;
}

export function exportCSV(products) {
  for (const product of products) {
    const materialsMap = collectMaterials(product);
    const materialsTable = toMaterialsTable(materialsMap);

    const csv = materialsTable.map((row) => row.join(';')).join('\n');

    const blob = new Blob([ csv ], { type: 'text/plain;charset=utf-8' });

    saveAs(blob, `${ product.name.replaceAll(' ', '_') }.materials-bom-export.csv`);
  }
}

export function exportTable(products) {
  for (const product of products) {
    const materialsMap = collectMaterials(product);
    const materialsTable = toMaterialsTable(materialsMap);

    const str = table(materialsTable, {
      drawVerticalLine: () => false
    });

    const blob = new Blob([ str ], { type: 'text/plain;charset=utf-8' });

    saveAs(blob, `${ product.name.replaceAll(' ', '_') }.materials-table-export.txt`);
  }
}
