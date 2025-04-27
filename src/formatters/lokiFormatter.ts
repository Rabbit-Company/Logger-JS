import { Levels } from "../constants/levels";
import type { LogEntry, LokiStream } from "../types";

/**
 * Formats a log entry for Loki with label management and cardinality control.
 *
 * @param {LogEntry} entry - The log entry containing message, level, timestamp and metadata
 * @param {number} maxLabelCount - Maximum number of labels allowed (0 for no limit)
 * @param {Record<string, string>} labels - Base labels to include in all logs
 * @returns {{streams: LokiStream[]}} Loki-compatible log format with streams
 *
 * @example
 * // Basic usage
 * formatLokiMessage(logEntry, 30, {app: "my-app"});
 *
 * @example
 * // Unlimited labels
 * formatLokiMessage(logEntry, 0, {env: "production"});
 */
export function formatLokiMessage(entry: LogEntry, maxLabelCount: number, labels: Record<string, string> = {}): { streams: LokiStream[] } {
	const baseLabels = {
		level: Levels[entry.level],
		...labels,
	};

	const metadataLabels = entry.metadata || {};

	const allLabels = {
		...baseLabels,
		...metadataLabels,
	};

	const totalLabels = Object.keys(allLabels).length;
	let finalLabels = allLabels;

	if (maxLabelCount > 0 && totalLabels > maxLabelCount) {
		const labelEntries = Object.entries(allLabels);

		finalLabels = Object.fromEntries([
			["level", allLabels.level],
			...Object.entries(labels),
			...labelEntries.filter(([key]) => key !== "level" && !labels[key]).slice(0, maxLabelCount - 1 - Object.keys(labels).length),
		]) as Record<string, string> & { level: string };
	}

	return {
		streams: [
			{
				stream: finalLabels,
				values: [[(new Date(entry.timestamp).getTime() * 1000000).toString(), entry.message]],
			},
		],
	};
}
