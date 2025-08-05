export let flows: any[] = [
    {
        id: '1',
        name: 'Flow 1',
        description: 'Description of Flow 1',
        files: ['Facture', 'Bulletin'],
        agents: [
            {
                id: 'agent1',
                name: 'Agent 1',
            },
            {
                id: 'agent2',
                name: 'Agent 2',
            }
        ],
        status: 'active',
        updatedAt: new Date('2023-10-01T12:00:00Z'),
    },
    {
        id: '2',
        name: 'Flow 2',
        description: 'Description of Flow 2',
        files: ['Facture'],
        agents: [
            {
                id: 'agent3',
                name: 'Agent 3',
            }
        ],
        status: 'inactive',
        updatedAt: new Date('2023-10-02T12:00:00Z'),
    },
    {
        id: '3',
        name: 'Flow 3',
        description: 'Description of Flow 3',
        files: ['Bulletin'],
        agents: [
            {
                id: 'agent4',
                name: 'Agent 4',
            }
        ],
        status: 'active',
        updatedAt: new Date('2023-10-03T12:00:00Z'),
    },
    {
        id: '4',
        name: 'Flow 4',
        description: 'Description of Flow 4',
        files: ['Facture', 'Bulletin'],
        agents: [
            {
                id: 'agent5',
                name: 'Agent 5',
            }
        ],
        status: 'deleted',
        updatedAt: new Date('2023-10-04T12:00:00Z'),
    }
];