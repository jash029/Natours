import { useEffect} from "react";
import toast from "react-hot-toast";


import { BookMarkContainer, BookMarkGrid} from "./BookMarkTour.styles";
import { useNavigate } from "react-router-dom";
import {
  Card,
  ImageWrapper,
  Image,
  Badge,
  Content,
  TopRow,
  Rating,
  Title,
  Meta,
  PriceSection,
  CurrentPrice,
  OriginalPrice,
  Discount,
  Footer,
  ViewDetails,
  BookmarkButton,
} from "../../../Tours/OfferSection/TrendingCard.styles";
import { HiOutlineBookmark } from "react-icons/hi2";
import useGetBookmark from "../../../../features/hooks/UserHooks/useGetBookmark";
import useRemoveBookmark from "../../../../features/hooks/UserHooks/useRemoveBookmark";

import useCurrencyDetector from "../../../../Services/useCurrencyDetector";

function BookMarkTour() {

   const {formatCurrency} = useCurrencyDetector();

  const { getBookmarkTour, data, isPending } = useGetBookmark({
    onSuccess(data) {
      console.log(data);
    },
    onError() {
      toast.error("Oops! Something went wrong. Try again later.");
    },
  });

  useEffect(() => {
    getBookmarkTour();
  }, [getBookmarkTour]);

  const { removeBookmarkTour, isPending: removePending } = useRemoveBookmark({

    onSuccess(){
      getBookmarkTour();
    },
    onError(){
      toast.error("Oops! Something went wrong. Try again later.");
    }
  });

  const navigate = useNavigate();
  if (isPending) {
    return <p style={{textAlign:"center",color:"white"}}>Loading bookmarked tours...</p>;
  }

  const tours = data?.bookmarks || [];

  if (!tours.length) {
    return <p style={{textAlign:"center",color:"white"}}>No Bookmarked Tours</p>;
  }

  return (
    <BookMarkContainer>
      <BookMarkGrid>
        {tours.map((bookmark) => {
          const tour = bookmark.tour_id;

          if (!tour) return null;

          const {
            _id,
            slug,
            name,
            imageCover,
            duration,
            destinations,
            ratingsAverage,
            ratingsQuantity,
            startingPrice,
            discount,
            theme,
          } = tour;

          const slugOrId = slug || _id ;

          function handleClick() {
            if (slugOrId) {
              navigate(`/tour/${slugOrId}`);
            }
          }
          const discountedPrice = startingPrice - discount;

          const discountPercentage =
            discount > 0 ? Math.round((discount / startingPrice) * 100) : 0;

          const location = destinations?.map((d) => d.country).join(", ");

          return (
            <Card key={_id} $category={theme}>
              <ImageWrapper>
                <Image
                  src={imageCover?.secureUrl}
                  alt={imageCover?.alt || name}
                />

                <Badge>{theme}</Badge>
                <BookmarkButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmarkTour(slugOrId);
                  }}
                  disabled={removePending}
                  aria-label="Remove bookmark"
                >
                  <HiOutlineBookmark size={22} fill="#ffffff" color='#ffffff' />
                </BookmarkButton>
              </ImageWrapper>

              <Content>
                <TopRow>
                  <Rating>
                    ★ {ratingsAverage.toFixed(1)} ({ratingsQuantity})
                  </Rating>
                </TopRow>

                <Title>{name}</Title>

                <Meta>
                  {location.split(",")[0]} • {duration.days} Days /{" "}
                  {duration.nights} Nights
                </Meta>

                <PriceSection>
                  <CurrentPrice>
                    From {formatCurrency(discountedPrice)}
                  </CurrentPrice>

                  <Footer>
                    {discount > 0 ? (
                      <>
                        <OriginalPrice>
                          {formatCurrency(startingPrice)}
                        </OriginalPrice>

                        <Discount>{discountPercentage}% OFF</Discount>
                      </>
                    ) : (
                      <OriginalPrice>&nbsp;</OriginalPrice>
                    )}
                  </Footer>
                </PriceSection>

                <ViewDetails onClick={() => handleClick()}>
                  View Details →
                </ViewDetails>
              </Content>
            </Card>
          );
        })}
      </BookMarkGrid>
    </BookMarkContainer>
  );
}

export default BookMarkTour;
