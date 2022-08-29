import React, { useState, useEffect } from "react";

/* React Bootstrap */
import { Button, Container } from "react-bootstrap";
import { Modal, Form } from "react-bootstrap";

/* Validators */
import useValidator from "../../../utils/useValidator";
import * as Yup from "yup";
import Header from "../../Header";

const UserList = [
  {
    id: 1,
    name: "John Doe",
  },
  {
    id: 2,
    name: "Michel Janson",
  },
  {
    id: 3,
    name: "Castiel Jason",
  },
];

export default function Validation() {
  const [dateData, setDateData] = React.useState([]);
  function onSubmit() {}

  useEffect(() => {
    let def = ["00", 15, 30, 45].map((element) => {
      return `00:${element}`;
    });

    let arr = Array.from({ length: 24 }, (i, val) => {
      let test = def.map((value) => {
        let a = value.split(":");
        a[0] = val.toString().length == 1 ? `0${val}` : val;
        return a.join(":");
      });
      return test;
    });

    setDateData(arr.flat());
    console.log("Sddss", arr.flat());
  }, []);

  const {
    values,
    setValues,
    touched,
    handleBlur,
    errors,
    handleSubmit,
    clearFormState,
    getFieldProps,
  } = useValidator({
    initialValues: {
      user_id: "",
      date: "",
      start_time: "",
      end_time: "",
    },
    validationSchema: Yup.object({
      user_id: Yup.string().required("User is Required."),
      date: Yup.string().required("Date is Required."),
      start_time: Yup.string().required("Start time is Required."),
      end_time: Yup.string().required("End time is Required."),
    }),
    onSubmit,
  });

  //  useEffect(() => {
  //    if (isOneOffEditModalOpen && singleOneOffData?.id) {
  //      setValues({
  //        ...values,
  //        barber_id: singleOneOffData?.barber_id,
  //        date: singleOneOffData?.date,
  //        start_time: singleOneOffData?.start_time.substring(
  //          0,
  //          singleOneOffData?.start_time.length - 3
  //        ),
  //        end_time: singleOneOffData?.end_time.substring(
  //          0,
  //          singleOneOffData?.end_time.length - 3
  //        ),
  //        id: singleOneOffData?.id,
  //      });
  //    }
  //  }, [singleOneOffData, isOneOffEditModalOpen]);

  console.log("values >>", values);
  return (
    <Container>
      <div style={{ width: "50%" }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>User</Form.Label>
            <Form.Select
              size="lg"
              className="of__modal__input"
              value={values?.user_id}
              onChange={(e) =>
                setValues({ ...values, user_id: e.target.value })
              }
            >
              <option>Choose user</option>
              {UserList?.length > 0 ? (
                UserList?.map((ele, i) => (
                  <option key={i} value={ele?.id}>
                    {ele?.name}
                  </option>
                ))
              ) : (
                <option>No User found!</option>
              )}
            </Form.Select>
            {touched?.user_id && errors?.user_id ? (
              <Form.Text id="passwordHelpBlock" style={{ color: "red" }}>
                {errors?.user_id}
              </Form.Text>
            ) : (
              ""
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="duedate"
              placeholder="Due date"
              value={values.date}
              onChange={(e) => setValues({ ...values, date: e.target.value })}
            />
            {touched?.date && errors?.date ? (
              <Form.Text id="passwordHelpBlock" style={{ color: "red" }}>
                {errors?.date}
              </Form.Text>
            ) : (
              ""
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="of__modal__input__box" style={{ width: "48%" }}>
                <Form.Label>Start time</Form.Label>
                <Form.Select
                  size="lg"
                  className="of__modal__input"
                  value={values.start_time}
                  onChange={(e) =>
                    setValues({ ...values, start_time: e.target.value })
                  }
                >
                  {dateData?.length > 0 &&
                    dateData?.map((ele, i) => (
                      <option key={i} value={ele}>
                        {ele}
                      </option>
                    ))}
                </Form.Select>
                {touched?.start_time && errors?.start_time ? (
                  <Form.Text id="passwordHelpBlock" style={{ color: "red" }}>
                    {errors?.start_time}
                  </Form.Text>
                ) : (
                  ""
                )}
              </div>

              {values?.start_time && (
                <div className="of__modal__input__box" style={{ width: "48%" }}>
                  <Form.Label>End time</Form.Label>

                  <Form.Select
                    size="lg"
                    className="of__modal__input"
                    value={values.end_time}
                    onChange={(e) =>
                      setValues({ ...values, end_time: e.target.value })
                    }
                  >
                    {dateData?.length > 0 &&
                      dateData?.map((ele, i) => (
                        <option key={i} value={ele}>
                          {ele}
                        </option>
                      ))}
                  </Form.Select>
                  {touched?.end_time && errors?.end_time ? (
                    <Form.Text id="passwordHelpBlock" style={{ color: "red" }}>
                      {errors?.end_time}
                    </Form.Text>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </div>
    </Container>
  );
}
