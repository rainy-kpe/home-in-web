/**
 * The feed object
 */
interface Feed {
    // The type of the feed
    type: "rss";

    // Unique identifier for the feed
    id: string;

    // The feed's position
    order: number;

    // The name of the feed
    name: string;

    // The feed urls
    urls?: Array<string>;

    // Marker for drag
    dragging?: boolean;
}

/**
 * The weather object
 */
interface Weather {
    current: {
        temp: number;
        text: string;
        icon: string;
    };
    forecast: {
        low: number;
        high: number;
        day: string;
        text: string;
        icon: string;
    }[];
}
