// Global variables for spell slots
let currentView = 'spellList';
let spellSlots = {};

// PF2e Spell Slot Progression
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

// Function to switch between views
function switchView(view) {
    currentView = view;
    const spellListContainer = document.getElementById('spellContainer');
    const spellSlotsContainer = document.getElementById('spellSlotsContainer');
    
    if (view === 'spellList') {
        spellListContainer.classList.remove('hidden');
        spellSlotsContainer.classList.add('hidden');
    } else {
        spellListContainer.classList.add('hidden');
        spellSlotsContainer.classList.remove('hidden');
        renderSpellSlots();
    }
}

// Function to render spell slots based on selected level
function getMaxSpellLevel(characterLevel) {
    if (characterLevel < 3) return 1;
    if (characterLevel < 5) return 2;
    if (characterLevel < 7) return 3;
    if (characterLevel < 9) return 4;
    if (characterLevel < 11) return 5;
    if (characterLevel < 13) return 6;
    if (characterLevel < 15) return 7;
    if (characterLevel < 17) return 8;
    if (characterLevel < 19) return 9;
    return 10;
}

// Updated renderSpellSlots function
function renderSpellSlots() {
    const container = document.getElementById('spellSlotsContainer');
    const characterLevel = parseInt(document.getElementById('maxLevelSelect').value, 10);
    const selectedClass = document.getElementById('classSelect').value;
    
    if (selectedClass === 'All') {
        container.innerHTML = '<div class="text-center py-4">Please select a class to view spell slots.</div>';
        return;
    }

    const progression = spellSlotsProgression[characterLevel];
    const maxSpellLevel = getMaxSpellLevel(characterLevel);
    
    if (!progression) {
        container.innerHTML = '<div class="text-center py-4">Invalid character level.</div>';
        return;
    }

    container.innerHTML = '';
    
    // Create Cantrip slots
    const cantripContainer = document.createElement('div');
    cantripContainer.className = 'mb-6';
    cantripContainer.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Cantrips (Level ${Math.floor((characterLevel - 1) / 2)})</h3>
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
        if (level <= maxSpellLevel) {  // Only show slots up to max spell level for character level
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

// Function to open the slot selection modal
function openSlotModal(level, slotIndex) {
    const slotId = `slot-${level}-${slotIndex}`;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-lg w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">
                    Select Spell for ${level === 0 ? 'Cantrip' : `Level ${level}`} Slot
                </h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">×</button>
            </div>
            <div class="max-h-96 overflow-y-auto" id="slotSpellList">
                Loading spells...
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Filter spells for this level and current class/association
    const selectedClass = document.getElementById('classSelect').value;
    const selectedAssociation = document.getElementById('associationSelect').value;
    
    const availableSpells = allSpells.filter(spell => {
        const spellLevel = getSpellLevel(spell);
        if (spellLevel !== level) return false;
        
        // Apply class and association filters
        if (selectedClass !== "All") {
            const classObj = classData.find(item => item.class === selectedClass);
            if (!classObj) return false;
            
            if (selectedAssociation !== "All") {
                return (spell.traditions || []).includes(selectedAssociation) ||
                       (spell.traits || []).includes(selectedAssociation);
            }
        }
        return true;
    });
    
    // Render available spells
    const spellList = modal.querySelector('#slotSpellList');
    spellList.innerHTML = availableSpells.length ? '' : 'No spells available for this slot.';
    
    availableSpells.forEach(spell => {
        const spellDiv = document.createElement('div');
        spellDiv.className = 'p-2 hover:bg-gray-100 cursor-pointer';
        spellDiv.innerHTML = `
            <div class="font-medium">${spell.name}</div>
            <div class="text-sm text-gray-600">${spell.traits ? spell.traits.join(', ') : ''}</div>
        `;
        spellDiv.onclick = () => {
            assignSpellToSlot(slotId, spell);
            modal.remove();
            renderSpellSlots();
        };
        spellList.appendChild(spellDiv);
    });
}

// Function to assign a spell to a slot
function assignSpellToSlot(slotId, spell) {
    spellSlots[slotId] = {
        name: spell.name,
        level: getSpellLevel(spell),
        traditions: spell.traditions,
        traits: spell.traits
    };
    saveSpellSlots();
}

// Save spell slots to localStorage
function saveSpellSlots() {
    localStorage.setItem('spellSlots', JSON.stringify(spellSlots));
}

// Load spell slots from localStorage
function loadSpellSlots() {
    const saved = localStorage.getItem('spellSlots');
    if (saved) {
        spellSlots = JSON.parse(saved);
    }
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load saved spell slots
    loadSpellSlots();
    
    // Add event listener for view switching
    document.querySelectorAll('input[name="pageView"]').forEach(radio => {
        radio.addEventListener('change', (e) => switchView(e.target.value));
    });
});
