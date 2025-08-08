import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class PlacesService {
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey =
      this.configService.get<string>("GOOGLE_MAPS_API_KEY") ||
      "AIzaSyAm-glVCWV1ScUX-3GrVKhrcpslIojwCmg";
  }

  async searchPlaces(query: string, country: string = "bd") {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: query,
            key: this.apiKey,
            types: "geocode|establishment",
            components: `country:${country}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error searching places:", error);
      throw new Error("Failed to search places");
    }
  }

  async getPlaceDetails(placeId: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            fields: "geometry,name,formatted_address",
            key: this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error getting place details:", error);
      throw new Error("Failed to get place details");
    }
  }
}
