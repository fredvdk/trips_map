import React, { JSX, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trip } from '../models/Trip'

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
'use client'


export default function NewTripPage(): JSX.Element {
    const router = useRouter()
    const [form, setForm] = useState<Trip>({
            id: '', // or a default value
            destination: '',
            state: '',
            from: new Date(),
            till: new Date(),
            hotel: '',
            hotelCost: 0,
            transportMode: '',
            // Add all other required fields with default values
            // e.g. notes: '', participants: [], etc.
        })
// ...existing code...)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function update<K extends keyof TripPayload>(key: K, value: TripPayload[K]) {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!form.title.trim()) {
            setError('Title is required')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || 'Failed to create trip')
            }

            // if API returns created resource, you can navigate to it
            // const created = await res.json()
            // router.push(`/trips/${created.id}`)

            router.push('/trips')
        } catch (err) {
            setError(err?.message ?? 'Unexpected error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: 700, margin: '2rem auto', padding: 16 }}>
            <h1 style={{ marginBottom: 12 }}>Create a new Trip</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', fontWeight: 600 }}>Title *</label>
                    <input
                        value={form.title}
                        onChange={e => update('title', e.target.value)}
                        placeholder="Trip title"
                        style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                        required
                        aria-required
                    />
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', fontWeight: 600 }}>Location</label>
                    <input
                        value={form.location}
                        onChange={e => update('location', e.target.value)}
                        placeholder="City, Country"
                        style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 600 }}>Start</label>
                        <input
                            type="date"
                            value={form.startDate}
                            onChange={e => update('startDate', e.target.value)}
                            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 600 }}>End</label>
                        <input
                            type="date"
                            value={form.endDate}
                            onChange={e => update('endDate', e.target.value)}
                            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontWeight: 600 }}>Description</label>
                    <textarea
                        value={form.description}
                        onChange={e => update('description', e.target.value)}
                        placeholder="Optional notes about the trip"
                        rows={4}
                        style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                </div>

                {error && (
                    <div style={{ color: 'crimson', marginBottom: 12 }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 16px',
                        background: '#006bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Creating…' : 'Create Trip'}
                </button>
            </form>
        </div>
    )
}