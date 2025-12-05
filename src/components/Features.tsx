import React, { useState } from 'react';
import type { Feature } from '../types';

interface FeaturesProps {
    features: Feature[];
    onAddFeature: () => void;
    onRemoveFeature: (id: string) => void;
    onUpdateFeature: (id: string, field: keyof Feature, value: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ features, onAddFeature, onRemoveFeature, onUpdateFeature }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="features-card card">
            <div className="features-header">
                <h3>Features & Traits</h3>
            </div>

            <div className="features-list">
                {features.map((feature) => (
                    <div key={feature.id} className={`feature-item-container ${expandedId === feature.id ? 'expanded' : ''}`}>
                        <div className="feature-row">
                            <div className="col-name">
                                <input
                                    value={feature.name}
                                    onChange={(e) => onUpdateFeature(feature.id, 'name', e.target.value)}
                                    placeholder="Feature Name"
                                    className="feature-name-input"
                                />
                                <button
                                    className="expand-btn"
                                    onClick={() => toggleExpand(feature.id)}
                                    title="Toggle Details"
                                >
                                    {expandedId === feature.id ? '▼' : '▶'}
                                </button>
                            </div>
                            <div className="col-source">
                                <input
                                    value={feature.source}
                                    onChange={(e) => onUpdateFeature(feature.id, 'source', e.target.value)}
                                    placeholder="Source"
                                    className="feature-source-input"
                                />
                            </div>
                            <div className="col-actions">
                                <button
                                    className="remove-btn"
                                    onClick={() => onRemoveFeature(feature.id)}
                                    title="Remove feature"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {expandedId === feature.id && (
                            <div className="feature-details">
                                <textarea
                                    value={feature.description}
                                    onChange={(e) => onUpdateFeature(feature.id, 'description', e.target.value)}
                                    placeholder="Description..."
                                    className="feature-desc-input"
                                    rows={3}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button className="add-feature-btn" onClick={onAddFeature}>
                + Add Feature
            </button>

            <style>{`
                .features-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }
                .features-header {
                    padding-bottom: var(--spacing-xs);
                    border-bottom: 1px solid var(--border-color);
                }
                .features-list {
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    max-height: 400px;
                }
                
                .feature-item-container {
                    background-color: var(--bg-tertiary);
                    border-radius: 4px;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }
                .feature-item-container.expanded {
                    border-color: var(--accent-gold);
                    background-color: var(--bg-secondary);
                }
                
                .feature-row {
                    display: flex;
                    align-items: center;
                    padding: 4px var(--spacing-xs);
                    min-height: 32px;
                }

                .col-name { flex: 1; display: flex; align-items: center; gap: 4px; }
                .col-source { width: 80px; margin-left: 8px; }
                .col-actions { width: 24px; text-align: center; }

                input {
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    font-family: inherit;
                    width: 100%;
                }
                input:focus {
                    outline: none;
                    background-color: rgba(255, 255, 255, 0.05);
                    border-radius: 2px;
                }
                
                .feature-name-input {
                    font-weight: 500;
                }
                .feature-source-input {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-align: right;
                }

                .expand-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 0.6rem;
                    padding: 4px;
                    cursor: pointer;
                    opacity: 0.5;
                }
                .expand-btn:hover { opacity: 1; color: var(--accent-gold); }

                .remove-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 1.2rem;
                    padding: 0;
                    cursor: pointer;
                    opacity: 0.5;
                }
                .remove-btn:hover { opacity: 1; color: var(--accent-red); }

                .feature-details {
                    padding: 0 var(--spacing-xs) var(--spacing-xs);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .feature-desc-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    font-family: inherit;
                    resize: vertical;
                    min-height: 60px;
                    margin-top: 4px;
                }
                .feature-desc-input:focus {
                    outline: none;
                }

                .add-feature-btn {
                    background-color: var(--bg-tertiary);
                    border: 1px dashed var(--border-color);
                    color: var(--text-secondary);
                    padding: var(--spacing-xs);
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                }
                .add-feature-btn:hover {
                    border-color: var(--accent-gold);
                    color: var(--accent-gold);
                    background-color: rgba(212, 175, 55, 0.1);
                }
            `}</style>
        </div>
    );
};
