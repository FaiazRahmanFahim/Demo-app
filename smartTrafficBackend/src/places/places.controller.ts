import { Controller, Get, Query, Param } from "@nestjs/common";
import { PlacesService } from "./places.service";

@Controller("api/places")
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get("search")
  async searchPlaces(
    @Query("query") query: string,
    @Query("country") country: string = "bd"
  ) {
    if (!query || query.trim().length < 2) {
      return { status: "ERROR", predictions: [] };
    }

    try {
      const result = await this.placesService.searchPlaces(query, country);
      return result;
    } catch (error) {
      return { status: "ERROR", error: error.message };
    }
  }

  @Get("details/:placeId")
  async getPlaceDetails(@Param("placeId") placeId: string) {
    try {
      const result = await this.placesService.getPlaceDetails(placeId);
      return result;
    } catch (error) {
      return { status: "ERROR", error: error.message };
    }
  }
}
