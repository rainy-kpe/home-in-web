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