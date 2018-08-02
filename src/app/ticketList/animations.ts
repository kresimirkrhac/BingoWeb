import { trigger, transition, style, animate, keyframes } from "@angular/animations"

export const rowInOutTriger = trigger('rowInOut', [
    transition(':enter', [
        style({
            opacity: 0,
            height: 0
        }),
        animate('160ms ease-out')
    ])
]);

export const detailInOutTriger = trigger('detailInOut', [
    transition(':enter', [
        style({
            opacity: 0,
            height: 0
        }),
        animate('200ms', style({
                opacity: 1,
                height: '*',
                offset: 1
            })
        )
    ]),
    transition(':leave', [
        style({
            opacity: 0.5,
            height: '*'
        }),
        animate('200ms ease-in',
            style({
                opacity: 0,
                height: 0
            })
        )
    ])
]);