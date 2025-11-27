import { corsHeaders } from "@/lib/cors";
import { connectDB } from "@/lib/mongodb";
import { createSupabaseClient } from "@/lib/supabase";
import supabaseMediaUpload from "@/lib/supabaseMediaUpload";
import CardContent from "@/models/CardContentModel";
import MediaContent from "@/models/MediaContentModel";
import TextContent from "@/models/TextContentModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);
  return new NextResponse(null, { status: 204, headers });
}

const contentTypes = ["text", "media", "card"];
const pages = [
  "home",
  "about",
  "solutions",
  "services",
  "industries",
  "contact",
];
const contentModels: Record<string, mongoose.Model<any>> = {
  text: TextContent,
  media: MediaContent,
  card: CardContent,
};

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
  const contentType = searchParams.get("contentType");

  if (!contentType) {
    return NextResponse.json(
      {
        message: "please provide a content type to fetch",
      },
      {
        status: 400,
      }
    );
  }
  if (!page) {
    return NextResponse.json(
      {
        message: "please provide page to fetch data from",
      },
      {
        status: 400,
      }
    );
  }
  if (!contentTypes.includes(contentType)) {
    return NextResponse.json(
      {
        message: `invalid content type ${contentType}`,
      },
      {
        status: 400,
      }
    );
  }
  if (!pages.includes(page)) {
    return NextResponse.json(
      {
        message: `could not find page ${page}`,
      },
      {
        status: 400,
      }
    );
  }

  await connectDB();
  const ContentModel = contentModels[contentType];
  try {
    const data = await ContentModel.findOne({ page: page });
    if (!data)
      return NextResponse.json(
        { message: "could not fetch data" },
        { status: 400 }
      );
    const res = NextResponse.json(data, { headers });

    // res.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
    // res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  } catch (error) {
    return NextResponse.json(
      {
        message: `some error occured in fetching the data ${error}`,
      },
      {
        status: 400,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
  const contentType = searchParams.get("contentType");
  const blockType = searchParams.get("blockType");
  // console.log(contentType, page, blockType);
  // console.log(req.body);

  if (!contentType) {
    return NextResponse.json(
      {
        message: "please provide a content type to post",
      },
      {
        status: 400,
      }
    );
  }
  if (!page) {
    return NextResponse.json(
      {
        message: "please provide page to post data to",
      },
      {
        status: 400,
      }
    );
  }
  if (!blockType) {
    return NextResponse.json(
      {
        message: "please provide block type to post data to",
      },
      {
        status: 400,
      }
    );
  }
  if (!contentTypes.includes(contentType.toString())) {
    return NextResponse.json(
      {
        message: `invalid content type ${contentType}`,
      },
      {
        status: 400,
      }
    );
  }
  if (!pages.includes(page.toString())) {
    return NextResponse.json(
      {
        message: `could not find page ${page}`,
      },
      {
        status: 400,
      }
    );
  }

  if (contentType === "text") {
    const { title, subtitle, text } = await req.json();

    try {
      const data = await TextContent.findOneAndUpdate(
        { page: page },
        {
          $set: {
            "content.$[item].title": title || "",
            "content.$[item].subtitle": subtitle || "",
            "content.$[item].text": text || "",
          },
        },
        {
          arrayFilters: [{ "item.block_type": blockType }],
        }
      );

      // console.log(data);
      if (!data)
        return NextResponse.json(
          {
            message:
              "could not post data. Possibly due to non existing block type",
          },
          { status: 400 }
        );

      return NextResponse.json(
        {
          message: "successfully updated data",
          data: data,
        },
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json(
        {
          message: `some error occured in fetching the data`,
          error: error.message,
        },
        { status: 400 }
      );
    }
  }
  if (contentType === "media") {
    try {
      const media = (await req.formData()).get("media") as File | null;
      if (!media)
        return NextResponse.json(
          { message: "no file uploaded" },
          { status: 400 }
        );
      await createSupabaseClient();
      const media_path = await supabaseMediaUpload(media);
      console.log(media_path);
      if (!media_path)
        return NextResponse.json(
          { message: "no file uploaded" },
          { status: 400 }
        );

      const data = await MediaContent.findOneAndUpdate(
        { page: page, "content.block_type": blockType },
        {
          $set: {
            "content.$[item].media_path": media_path || null,
          },
        },
        {
          arrayFilters: [{ "item.block_type": blockType }],
        }
      );

      // console.log(data);
      if (!data)
        return NextResponse.json(
          { message: "could not post data" },
          { status: 400 }
        );

      return NextResponse.json(
        {
          message: "successfully updated data",
          data: data,
        },
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json(
        {
          message: `some error occured in fetching the data`,
          error: error.message,
        },
        { status: 400 }
      );
    }
  }
  if (contentType === "card") {
    const body = await req.json();

    // Validate body
    if (!body.cards || !Array.isArray(body.cards)) {
      return NextResponse.json(
        { message: "cards array is required" },
        { status: 400 }
      );
    }
    // console.log(body);
    // console.log("blockType from FE:", blockType);
    // const doc = await CardContent.findOne({ page });
    // const target = doc.content.find((c) => c.block_type === blockType);
    // console.log("MATCH FOUND:", !!target);
    // console.log("TARGET DATA:", target);

    const cards = body.cards.map((c: any) => ({
      ...c,
      _id: new mongoose.Types.ObjectId(c._id),
    }));

    try {
      const data = await CardContent.findOneAndUpdate(
        { page: page },
        {
          $set: {
            "content.$[item].cards": cards,
          },
        },
        {
          arrayFilters: [{ "item.block_type": blockType }],
          new: true, // return updated doc
          strict: false, // do not strict check types and properties
        }
      );

      if (!data) {
        return NextResponse.json(
          {
            message: `could not update card data. Possibly missing block_type "${blockType}"`,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          message: "successfully updated card data",
          data,
        },
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json(
        {
          message: "error updating card data",
          error: error.message,
        },
        { status: 400 }
      );
    }
  }
}
