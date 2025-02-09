// Add this to the top of spellslotscript.js
const spellSlotsProgression = {
    1:  { cantrips: 5, slots: [2] },
    2:  { cantrips: 5, slots: [3] },
    3:  { cantrips: 5, slots: [3, 2] },
    4:  { cantrips: 5, slots: [3, 3] },
    5:  { cantrips: 5, slots: [3, 3, 2] },
    6:  { cantrips: 5, slots: [3, 3, 3] },
    7:  { cantrips: 5, slots: [3, 3, 3, 2] },
    8:  { cantrips: 5, slots: [3, 3, 3, 3] },
    9:  { cantrips: 5, slots: [3, 3, 3, 3, 2] },
    10: { cantrips: 5, slots: [3, 3, 3, 3, 3] },
    11: { cantrips: 5, slots: [3, 3, 3, 3, 3, 2] },
    12: { cantrips: 5, slots: [3, 3, 3, 3, 3, 3] },
    13: { cantrips: 5, slots: [3, 3, 3, 3, 3, 3, 2] },
    14: { cantrips: 5, slots: [3, 3, 3, 3, 3, 3, 3] },
    15: { cantrips: 5, slots: [3, 3, 3, 3, 3, 3, 3, 2] },
    16: { cantrips: 5, slots: [3, 3, 3, 3, 3, 3, 3, 3] },
    17: { cantrips: 5, slots: [3, 3, 3, 3, 3, 3, 3, 3, 1] },
    18: { cantrips: 5, slots: [3, 3, 3, 3, 3, 3, 3, 3, 1] },
    19: { cantrips: 5, slots: [3, 3, 3, 3, 3, 3, 3, 3, 1] },
    20: { cantrips: 5, slots: [3, 3, 3, 3, 3, 3, 3, 3, 2, 1] }
};

// Update the renderSpellSlots function
function renderSpellSlots() {
    const container = document.getElementById('spellSlotsContainer');
    const maxLevel = parseInt(document.getElementById('maxLevelSelect').value, 10);
    const selectedClass = document.getElementById('classSelect').value;
    
    if (selectedClass === 'All') {
        container.innerHTML = '<div class="text-center py-4">Please select a class to view spell slots.</div>';
        return;
    }

    // Determine caster level based on maxLevel selection
    // In PF2e, spell level roughly corresponds to character level / 2
    const casterLevel = Math.min(maxLevel * 2, 20);
    const progression = spellSlotsProgression[casterLevel];
    
    if (!progression) {
        container.innerHTML = '<div class="text-center py-4">Invalid caster level.</div>';
        return;
    }

    container.innerHTML = '';
    
    // Create Cantrip slots
    const cantripContainer = document.createElement('div');
    cantripContainer.className = 'mb-6';
    cantripContainer.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Cantrips (Level ${Math.floor((casterLevel - 1) / 2)})</h3>
        <div class="grid grid-cols-5 gap-2">
            ${Array(progression.cantrips).fill(0).map((_, i) => `
                <button class="p-2 border rounded hover:bg-gray-100" 
                        onclick="openSlotModal(0, ${i})">
                    ${spellSlots['slot-0-' + i] ? 
                        `<div class="text-sm font-medium">${spellSlots['slot-0-' + i].name}</div>` :
                        '<div class="text-sm text-gray-500">Empty Cantrip</div>'}
                </button>
            `).join('')}
        </div>
    `;
    container.appendChild(cantripContainer);

    // Create spell level slots
    progression.slots.forEach((numSlots, index) => {
        const level = index + 1;
        if (level <= maxLevel) {  // Only show slots up to selected max level
            const levelContainer = document.createElement('div');
            levelContainer.className = 'mb-6';
            levelContainer.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">Level ${level} (${numSlots} slots)</h3>
                <div class="grid grid-cols-3 gap-2">
                    ${Array(numSlots).fill(0).map((_, i) => `
                        <button class="p-2 border rounded hover:bg-gray-100" 
                                onclick="openSlotModal(${level}, ${i})">
                            ${spellSlots['slot-' + level + '-' + i] ? 
                                `<div class="text-sm font-medium">${spellSlots['slot-' + level + '-' + i].name}</div>` :
                                '<div class="text-sm text-gray-500">Empty Slot</div>'}
                        </button>
                    `).join('')}
                </div>
            `;
            container.appendChild(levelContainer);
        }
    });

    // Add note about heightening
    const heighteningNote = document.createElement('div');
    heighteningNote.className = 'mt-4 p-4 bg-blue-50 rounded';
    heighteningNote.innerHTML = `
        <p class="text-sm text-blue-800">
            <strong>Note:</strong> In Pathfinder 2e, you can heighten spells to use higher-level spell slots. 
            When preparing spells, you can place a lower-level spell in a higher-level slot to cast it at that higher level.
        </p>
    `;
    container.appendChild(heighteningNote);
}
